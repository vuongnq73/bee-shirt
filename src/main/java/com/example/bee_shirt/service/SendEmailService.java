package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.PasswordReset;
import com.example.bee_shirt.entity.VerificationToken;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.repository.AccountRepository;
import com.example.bee_shirt.repository.PasswordResetRepository;
import com.example.bee_shirt.repository.VerificationTokenRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
//in ra log
@Slf4j
public class SendEmailService {
    JavaMailSender mailSender;

    AccountRepository accountRepository;

    PasswordResetRepository passwordResetRepository;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    VerificationTokenRepository verificationTokenRepository;


    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new AppException(ErrorCode.EMAIL_SENDING_FAILED);
        }
    }


    public String forgotPassword(String email){
        Optional<Account> account = accountRepository.findByEmail(email);
        if(account.isEmpty()){
            throw new AppException(ErrorCode.ACCOUNT_NOT_FOUND);
        }
        String token = UUID.randomUUID().toString();
        PasswordReset resetToken = new PasswordReset();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30)); // 30 phút

        passwordResetRepository.save(resetToken);

        String newPass = generateRandomPassword(10);

        Account newAccount = account.get();
        newAccount.setPass(passwordEncoder.encode(newPass)); // Sử dụng PasswordEncoder
        accountRepository.save(newAccount);

        this.sendEmail(email, "Beeshirt cấp lại mật khẩu",
                "Dùng mật khẩu này để đăng nhập(Hãy thay đổi mật khẩu sau khi đăng nhập): " + newPass);

        return "Password reset email sent.";
    }

    public static String generateRandomPassword(int length) {
        // Định nghĩa các ký tự có thể có trong mật khẩu
        String upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        // Kết hợp tất cả các ký tự
        String allChars = upperCaseChars + lowerCaseChars + numbers + specialChars;

        // Sử dụng SecureRandom để tạo số ngẫu nhiên
        SecureRandom random = new SecureRandom();

        StringBuilder password = new StringBuilder(length);

        // Sinh ra mật khẩu ngẫu nhiên
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(allChars.length());  // Chọn ngẫu nhiên một ký tự từ tất cả các ký tự có sẵn
            password.append(allChars.charAt(index));
        }

        return password.toString();
    }

    @Scheduled(cron = "0 0 2 * * ?")  // Cron expression: 2 AM every day
    @Transactional
    public void deleteExpiredTokens() {
        passwordResetRepository.deleteExpiredTokens();
    }



    //Kiểm tra token
    public String verifyVerificationCode(String email, String token) {
    log.info("Verifying code for email: {}", email);

    // Lấy mã xác minh mới nhất từ database cho email
    VerificationToken verificationToken = verificationTokenRepository.findByEmail(email).stream()
            .findFirst()  // Lấy mã xác minh đầu tiên trong danh sách đã được sắp xếp
            .orElseThrow(() -> new AppException(ErrorCode.VERIFICATION_TOKEN_NOT_FOUND));  // Nếu không tìm thấy mã xác minh

    // Kiểm tra mã xác minh
    if (!verificationToken.getToken().equals(token)) {
        throw new AppException(ErrorCode.INVALID_VERIFICATION_CODE);  // Nếu mã không khớp
    }

    // Nếu mã hợp lệ, trả về thông báo thành công
    return "Verification code is valid.";

    }

}