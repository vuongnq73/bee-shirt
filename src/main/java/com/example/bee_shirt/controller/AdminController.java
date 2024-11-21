package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.dto.response.RoleResponse;
import com.example.bee_shirt.service.AccountService;
import com.example.bee_shirt.service.RoleService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {
    @Autowired
    private RoleService roleService;

    @Autowired
    private AccountService accountService;

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<RoleResponse>> getRoles(){
        return ApiResponse.<List<RoleResponse>>builder()
                .code(1000)
                .result(roleService.getAll())
                .build();
    }

    @GetMapping("/accounts")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getAccounts(){
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .result(accountService.getAll())
                .build();
    }

    @GetMapping("/staffs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getStaffs(){
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .result(accountService.getAllStaff())
                .build();
    }

    @GetMapping("/clients")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getClients(){
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .result(accountService.getAllClient())
                .build();
    }

    //thêm @Valid để create chạy validate
    @PostMapping("/create")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<AccountResponse> createUser( @Valid @RequestBody AccountCreationRequest request) {
        return ApiResponse.<AccountResponse>builder()
                .code(1000)
                .result(accountService.createAccount(request, true))
                .build();
    }
}
