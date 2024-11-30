package com.example.bee_shirt.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.request.AccountUpdateRequest;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AccountService {
    AccountMapper accountMapper;
    AccountRepository accountRepository;
    RoleRepository roleRepository;
    Cloudinary cloudinary;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public AccountResponse getMyInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return accountMapper.toUserResponse(account);
    }

    public List<AccountResponse> getAll() {
        return getAccountsWithRoles(accountRepository.getAll());
    }

    public List<AccountResponse> getAllClient() {
        return getAccountsWithRoles(accountRepository.getAllClient());
    }

    public List<AccountResponse> getAllStaff() {
        return getAccountsWithRoles(accountRepository.getAllStaff());
    }

    public List<AccountResponse> getAllPagingStaff(Pageable pageable) {
        Page<Account> page = accountRepository.getAllPagingStaff(pageable);
        return page.getContent().stream()
                .map(accountMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public int getAllTotalPageStaff() {
        long totalRecords = accountRepository.getAllTotalPageStaff(); // Tổng số tài khoản cho vai trò STAFF
        int pageSize = 5; // Số lượng tài khoản mỗi trang
        return (int) Math.ceil((double) totalRecords / pageSize); // Tính tổng số trang
    }

    public List<AccountResponse> getAllPagingClient(Pageable pageable) {
        Page<Account> page = accountRepository.getAllPagingClient(pageable);
        return page.getContent().stream()
                .map(accountMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public int getAllTotalPageClient() {
        long totalRecords = accountRepository.getAllTotalPageClient(); // Tổng số tài khoản cho vai trò STAFF
        int pageSize = 5; // Số lượng tài khoản mỗi trang
        return (int) Math.ceil((double) totalRecords / pageSize); // Tính tổng số trang
    }


    private List<AccountResponse> getAccountsWithRoles(List<Account> accounts) {
        accounts.forEach(account ->
                log.info("Account: {} - Roles: {}", account.getUsername(), account.getRole())
        );
        return accounts.stream()
                .map(accountMapper::toUserResponse)
                .toList();
    }


    public AccountResponse deleteAccount(String code){
        Account account =accountRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        account.setDeleted(true);

        return accountMapper.toUserResponse(accountRepository.save(account));
    }

    public AccountResponse createAccount(AccountCreationRequest request, boolean isAdmin) {
        validateUsername(request.getUsername());

        // Tạo mã tài khoản tự động
        String generatedCode = generateAccountCode();
        request.setCode(generatedCode);

        // Kiểm tra xem tài khoản đã tồn tại chưa
        if (accountRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        Account account = accountMapper.toUser(request);
        log.info("Mã tài khoản mới: {}", account.getCode());

        account.setPass(encodePassword(request.getPass()));
        account.setCreateBy(isAdmin ? this.getMyInfo().getCode() : "SYSTEM");
        account.setCreateAt(LocalDate.now());
        account.setDeleted(false);
        account.setAvatar(uploadAvatar(request.getAvatarFile()));

        Set<Role> roles = getRolesFromRequest(request.getRole());
        account.setRole(roles);

        return accountMapper.toUserResponse(accountRepository.save(account));
    }

    public AccountResponse updateAccount(AccountUpdateRequest request, String code) {
        Account account = accountRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));

        // Giữ nguyên giá trị cũ nếu là null
        if (request.getFirstName() != null) {
            account.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            account.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            account.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            account.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            account.setAddress(request.getAddress());
        }
        if (request.getStatus() != null) {
            account.setStatus(request.getStatus());
        }
        if (request.getDeleted() != null) {
            account.setDeleted(request.getDeleted());
        }
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            account.setAvatar(uploadAvatar(request.getAvatarFile()));
        }

        // Xử lý logic đổi mật khẩu (nếu có yêu cầu)
        if (request.getOldPassword() != null && request.getOldPassword().isEmpty() && request.getPass() != null && request.getPass().isEmpty()) {
            // Kiểm tra mật khẩu cũ
            if (!passwordEncoder.matches(request.getOldPassword(), account.getPass())) {
                throw new AppException(ErrorCode.INVALID_OLD_PASSWORD);
            }
            // Cập nhật mật khẩu mới
            account.setPass(encodePassword(request.getPass()));
        }

        account.setUpdateBy(this.getMyInfo().getCode());
        account.setUpdateAt(LocalDate.now());

        return accountMapper.toUserResponse(accountRepository.save(account));
    }


    private String uploadAvatar(MultipartFile avatarFile) {
        if (avatarFile != null && !avatarFile.isEmpty()) {
            try {
                return uploadFile(avatarFile);
            } catch (IOException e) {
                log.error("Error uploading file: {}", e.getMessage());
                throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }
        log.warn("No avatar file provided, using default avatar URL.");
        return "https://drive.google.com/file/d/1vGatwMMr89lX1l1_FkkhvyWZbCa40mD3/view?usp=drive_link"; // Cần thay thế bằng URL hợp lệ
    }

    private void validateUsername(String username) {
        if (accountRepository.findByUsername(username).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
    }

    private String generateAccountCode() {
        String lastCode = Optional.ofNullable(accountRepository.getTop1())
                .map(Account::getCode)
                .orElse("ACC0");

        if (lastCode.length() > 3) {
            String prefix = lastCode.substring(0, 3);
            int number = Integer.parseInt(lastCode.substring(3));
            return prefix + (number + 1);
        } else {
            return "ACC1";
        }
    }

    public AccountResponse findByCode(String code){
        Account account = accountRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_FOUND));
        return accountMapper.toUserResponse(account);
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

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
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }

        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            log.error("Upload file failed: {}", e.getMessage());
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

}
