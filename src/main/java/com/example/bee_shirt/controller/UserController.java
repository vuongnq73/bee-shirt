package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.request.DeliveryAddressRequest;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.service.AccountService;
import com.example.bee_shirt.service.RoleService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AccountResponse>> register(
            @Valid @ModelAttribute AccountCreationRequest request, @Valid @ModelAttribute DeliveryAddressRequest addressRequest,
            @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile) {

        // Kiểm tra avatarFile trong request
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            request.setAvatarFile(avatarFile);
        } else {
            // Nếu không có, có thể gán một giá trị mặc định
            request.setAvatarFile(null); // hoặc không cần gán gì
        }

        // Tạo tài khoản
        AccountResponse accountResponse = accountService.createAccount(request, false, addressRequest);

        ApiResponse<AccountResponse> response = ApiResponse.<AccountResponse>builder()
                .code(1000)
                .result(accountResponse)
                .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
