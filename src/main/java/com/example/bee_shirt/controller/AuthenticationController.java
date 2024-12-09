package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.AuthenticationRequest;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.dto.response.AuthenticationResponse;
import com.example.bee_shirt.service.AuthenticationService;
import com.example.bee_shirt.service.SendEmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
// Địa chỉ frontend
//Thay thế cho @Autowired
//@RequiredArgsConstructor sẽ tự động tạo contructor của những method đc khai báo là final
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    SendEmailService sendEmailService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestParam String email) {
        return ApiResponse.<String>builder()
                .result(sendEmailService.forgotPassword(email))
                .build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        return ApiResponse.<String>builder()
                .result(sendEmailService.resetPassword(token,newPassword))
                .build();
    }

}
