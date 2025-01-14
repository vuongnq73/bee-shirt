package com.example.bee_shirt.configuration;

import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.Role;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.repository.AccountRepository;
import com.example.bee_shirt.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

//@Configuration sẽ tự động chạy khi sạc application
@Configuration
//Thay thế cho @Autowired
//@RequiredArgsConstructor sẽ tự động tạo contructor của những method đc khai báo là final
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
//Để có thể logger được
@Slf4j
public class ApplicationConfig {

    PasswordEncoder passwordEncoder;

    RoleRepository roleRepository;

    //ApplicationRunner sẽ đc khởi chạy mỗi khi application sạc lên
    //mục đích ở đây là auto khởi tạo 1 user admin nếu chưa có admin khi sạc application
    @Bean
    ApplicationRunner applicationRunner(AccountRepository accountRepository){

        return args -> {
            if(accountRepository.findByUsername("admin").isEmpty()){
                Account account = Account.builder()
                        .username("admin")
                        .pass(passwordEncoder.encode("admin"))
                        .status(0)
                        .avatar("https://asset.cloudinary.com/dbshkldsj/d178b36973b41db7beffc0beed20ebf7")
                        .email("giangdtph40542@fpt.edu.vn")
                        .phone("0325762818")
                        .build();

                Set<Role> roles = new HashSet<>();
                roles.add(roleRepository.findRoleByCode("ADMIN").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)));
                roles.add(roleRepository.findRoleByCode("STAFF").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)));
                roles.add(roleRepository.findRoleByCode("USER").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)));

                account.setRole(roles); // Thiết lập quyền cho tài khoản

                // Tạo mã tài khoản tự động
                if (accountRepository.getTop1() == null) {
                    account.setCode("ACC1");
                } else {
                    //Lấy giá trị code đầu tiên
                    String lastCode = accountRepository.getTop1().getCode();

                    // Đảm bảo độ dài mã tài khoản đủ để cắt
                    if (lastCode.length() > 3) {
                        String prefix = lastCode.substring(0, 3); // 3 ký tự đầu
                        int number = Integer.parseInt(lastCode.substring(3)); // Phần số sau
                        account.setCode(prefix + (number + 1)); // Tạo mã mới
                    } else {
                        // Nếu mã cũ quá ngắn, sử dụng mã mặc định
                        account.setCode("ACC1");
                    }
                }
                System.out.println("Mã tài khoản mới: " + account.getCode());

                accountRepository.save(account);
                log.warn("admin was has beem created with default username: admin, password: admin, please change it");
            }
            // Tạo tài khoản khách vãng lai nếu chưa có
            if (accountRepository.findByUsername("khachvanglai").isEmpty()) {
                Account guestAccount = Account.builder()
                        .username("khachvanglai")
                        .pass(passwordEncoder.encode("khachvanglai")) // Mật khẩu mặc định cho khách
                        .status(0) // Có thể đặt trạng thái là 1 để biểu thị tài khoản đang hoạt động
                        .avatar("https://asset.cloudinary.com/dbshkldsj/default_guest_avatar.png") // Avatar mặc định
                        .email("guest@example.com")
                        .phone("0000000000")
                        .firstName("khach")
                        .lastName("vanglai")
                        .createBy("ad")
                        .createAt(LocalDate.now())
                        .updateBy("ad")
                        .deleted(false)
                        .updateAt(LocalDate.now())
                        .code("ACC0000")
                        .build();

                Set<Role> guestRoles = new HashSet<>();
                guestRoles.add(roleRepository.findRoleByCode("USER").orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND)));

                guestAccount.setRole(guestRoles);

                // Tạo mã tài khoản cho khách
                if (accountRepository.getTop1() == null) {
                    guestAccount.setCode("ACC00000");
                } else {
                    String lastCode = accountRepository.getTop1().getCode();
                    if (lastCode.length() > 3) {
                        String prefix = lastCode.substring(0, 3);
                        int number = Integer.parseInt(lastCode.substring(3));
                        guestAccount.setCode(prefix + (number + 1));
                    } else {
                        guestAccount.setCode("ACC00000");
                    }
                }

                accountRepository.save(guestAccount);
                log.warn("Guest account created with default username: guest, password: guest.");
            }
        };
    }
}
