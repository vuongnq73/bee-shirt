package com.example.bee_shirt.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.Role;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.mapper.AccountMapper;
import com.example.bee_shirt.repository.AccountRepository;
import com.example.bee_shirt.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountService {
    AccountMapper accountMapper;
    AccountRepository accountRepository;
    RoleRepository roleRepository;
    Cloudinary cloudinary;

    // Lấy thông tin người đang đăng nhập
    public AccountResponse getMyInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return accountMapper.toUserResponse(account);
    }

    public List<AccountResponse> getAll() {
        List<Account> accounts = accountRepository.getAll();
        accounts.forEach(account ->
                log.info("Account: {} - Roles: {}", account.getUsername(), account.getRole())
        );
        return accounts.stream()
                .map(accountMapper::toUserResponse)
                .toList();
    }

    public List<AccountResponse> getAllStaff() {
        List<Account> accounts = accountRepository.getAllStaff();
        accounts.forEach(account ->
                log.info("Account: {} - Roles: {}", account.getUsername(), account.getRole())
        );
        return accounts.stream()
                .map(accountMapper::toUserResponse)
                .toList();
    }

    public List<AccountResponse> getAllClient() {
        List<Account> accounts = accountRepository.getAllClient();
        accounts.forEach(account ->
                log.info("Account: {} - Roles: {}", account.getUsername(), account.getRole())
        );
        return accounts.stream()
                .map(accountMapper::toUserResponse)
                .toList();
    }

    // Tạo account (admin)
    public AccountResponse createAccount(AccountCreationRequest request, boolean isAdmin) {
        validateUsername(request.getUsername());

        // Tạo mã tài khoản tự động
        String generatedCode = generateAccountCode();
        request.setCode(generatedCode);

        // Kiểm tra xem tài khoản đã tồn tại chưa
        if (accountRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Chuyển đổi request thành account
        Account account = accountMapper.toUser(request);
        log.info("Mã tài khoản mới: {}", account.getCode());

        // Mã hóa mật khẩu
        account.setPass(encodePassword(request.getPass()));

        // Thiết lập người tạo
        account.setCreateBy(isAdmin ? this.getMyInfo().getCode() : "SYSTEM");
        account.setCreateAt(LocalDate.now());
        account.setDeleted(false);

        // Upload avatar lên Cloudinary hoặc dùng URL mặc định
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String avatarUrl;
            try {
                avatarUrl = this.uploadFile(request.getAvatarFile());
                account.setAvatar(avatarUrl); // Lưu URL ảnh vào avatar
            } catch (IOException e) {
                log.error("Lỗi khi upload file: {}", e.getMessage()); // Ghi log lỗi
                throw new AppException(ErrorCode.FILE_UPLOAD_FAILED); // Xử lý lỗi upload
            }
        } else {
            // Đường dẫn mặc định nếu không có file
            account.setAvatar("https://drive.google.com/file/d/1vGatwMMr89lX1l1_FkkhvyWZbCa40mD3/view?usp=drive_link");
        }

        // Lấy role từ request
        Set<Role> roles = getRolesFromRequest(request.getRole());
        account.setRole(roles);

        // Lưu tài khoản vào database và trả về
        return accountMapper.toUserResponse(accountRepository.save(account));
    }


    // Kiểm tra tài khoản với username "admin" đã tồn tại chưa
    private void validateUsername(String username) {
        // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu hay chưa
        if (accountRepository.findByUsername(username).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
    }

    // Tạo mã tài khoản tự động
    private String generateAccountCode() {
        String lastCode = Optional.ofNullable(accountRepository.getTop1())
                .map(Account::getCode)
                .orElse("ACC0");

        if (lastCode.length() > 3) {
            String prefix = lastCode.substring(0, 3); // 3 ký tự đầu
            int number = Integer.parseInt(lastCode.substring(3)); // Phần số sau
            return prefix + (number + 1); // Tạo mã mới
        } else {
            return "ACC1"; // Sử dụng mã mặc định
        }
    }

    // Mã hóa mật khẩu
    private String encodePassword(String password) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        return passwordEncoder.encode(password);
    }

    // Phương thức riêng để lấy role từ request
    private Set<Role> getRolesFromRequest(List<String> roleCodes) {
        Set<Role> roles = new HashSet<>();

        if (roleCodes == null || roleCodes.isEmpty()) {
            Role defaultRole = roleRepository.findRoleByCode("USER")
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
            roles.add(defaultRole);
        } else {
            for (String roleCode : roleCodes) {
                Role role = roleRepository.findRoleByCode(roleCode)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));
                roles.add(role);
            }
        }
        return roles;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        // Kiểm tra kiểu file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE); // Kiểm tra nếu file không phải là ảnh
        }

        try {
            // Upload file lên Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto")); // Tự động xác định loại tài nguyên
            return uploadResult.get("url").toString();  // Lấy URL của ảnh đã upload
        } catch (IOException e) {
            log.error("Upload file failed: {}", e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED); // Xử lý lỗi upload
        }
    }


}
