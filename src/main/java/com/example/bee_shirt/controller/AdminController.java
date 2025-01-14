package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.request.AccountUpdateRequest;
import com.example.bee_shirt.dto.request.DeliveryAddressRequest;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.dto.response.RoleResponse;
import com.example.bee_shirt.entity.DeliveryAddressGiang;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.service.AccountService;
import com.example.bee_shirt.service.RoleService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ApiResponse<List<RoleResponse>> getRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .code(1000)
                .result(roleService.getAll())
                .build();
    }

    @GetMapping("/accounts")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getAccounts() {
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .result(accountService.getAll())
                .build();
    }

    @GetMapping("/staffs")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getStaffs() {
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .result(accountService.getAllStaff())
                .build();
    }

    // phân trang staff
    @GetMapping("/staffs/{page}")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllPagingStaff(@PathVariable Integer page) {
        PageRequest pageRequest = PageRequest.of(page - 1, 5); //5 phần tử 1 trang
        List<AccountResponse> staffAccounts = accountService.getAllPagingStaff(pageRequest);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<AccountResponse>>builder()
                        .result(staffAccounts)
                        .message("Successfully retrieved paginated staff accounts.")
                        .build());
    }

    // tổng số trang staff
    @GetMapping("/totalPageStaff")
    public ResponseEntity<ApiResponse<Integer>> getAllTotalPageStaff() {
        int totalPages = accountService.getAllTotalPageStaff();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Integer>builder()
                        .result(totalPages)
                        .message("Total pages retrieved successfully.")
                        .build());
    }

    // phân trang client
    @GetMapping("/clients/{page}")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllPagingClient(@PathVariable Integer page) {
        PageRequest pageRequest = PageRequest.of(page - 1, 5); //5 phần tử 1 trang
        List<AccountResponse> staffAccounts = accountService.getAllPagingClient(pageRequest);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<AccountResponse>>builder()
                        .result(staffAccounts)
                        .message("Successfully retrieved paginated staff accounts.")
                        .build());
    }

    // tổng số trang client
    @GetMapping("/totalPageClient")
    public ResponseEntity<ApiResponse<Integer>> getAllTotalPageClient() {
        int totalPages = accountService.getAllTotalPageClient();
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<Integer>builder()
                        .result(totalPages)
                        .message("Total pages retrieved successfully.")
                        .build());
    }


    @GetMapping("/clients")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ApiResponse<List<AccountResponse>> getClients() {
        return ApiResponse.<List<AccountResponse>>builder()
                .code(1000)
                .result(accountService.getAllClient())
                .build();
    }

    //thêm @Valid để create chạy validate
    @PostMapping(value = "/create", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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

    // Endpoint để xoá tài khoản theo mã code
    @DeleteMapping("/delete/{code}")
    public ResponseEntity<ApiResponse<AccountResponse>> deleteUser(@PathVariable("code") String code) {
        try {
            AccountResponse deletedAccount = accountService.deleteAccount(code);
            return ResponseEntity.ok(
                    ApiResponse.<AccountResponse>builder()
                            .result(deletedAccount)
                            .message("Account deleted successfully.")
                            .build()
            );
        } catch (AppException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<AccountResponse>builder()
                            .message("Account not found.")
                            .build()
                    );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<AccountResponse>builder()
                            .message("An error occurred while deleting the account.")
                            .build()
                    );
        }
    }

    //thêm @Valid để update chạy validate
    @PutMapping(value = "/update/{code}", consumes = "multipart/form-data")
    public ApiResponse<AccountResponse> updateUser(
            @Valid
            @PathVariable("code") String code,
            @Valid @ModelAttribute AccountUpdateRequest request, @Valid @ModelAttribute DeliveryAddressRequest addressRequest,
            @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile) {

        log.info("Received account update request for user: {}", code);

        // Kiểm tra avatarFile trong request
        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            request.setAvatarFile(avatarFile);
        } else {
            // Nếu không có, có thể gán một giá trị mặc định
            request.setAvatarFile(null); // hoặc không cần gán gì
        }

        // Gọi service để thực hiện cập nhật
        AccountResponse accountResponse = accountService.updateAccount(request, code, addressRequest);

        // Trả về kết quả
        return ApiResponse.<AccountResponse>builder()
                .code(1000)
                .result(accountResponse)
                .build();
    }


    @GetMapping("/account/{code}")
    public ApiResponse<AccountResponse> getAccountWithCode(
            @PathVariable("code") String code
    ) {
        return ApiResponse.<AccountResponse>builder()
                .code(1000)
                .result(accountService.findByCode(code))
                .build();
    }

    @GetMapping("/myProfile")
    public ApiResponse<AccountResponse> getMyProfile(
    ) {
        return ApiResponse.<AccountResponse>builder()
                .code(1000)
                .result(accountService.getMyInfo())
                .build();
    }

    @GetMapping("/address/{code}")
    public ApiResponse<DeliveryAddressGiang> getAllByAccountCode(
            @PathVariable("code") String code
    ) {
        return ApiResponse.<DeliveryAddressGiang>builder()
                .code(1000)
                .result(accountService.findAllByAccountCode(code))
                .build();
    }

}
