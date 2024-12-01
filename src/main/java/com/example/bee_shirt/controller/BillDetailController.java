package com.example.bee_shirt.controller;


import com.example.bee_shirt.dto.request.BillDetailDTO;
import com.example.bee_shirt.dto.request.BillDetailOnlineDTO;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.service.BillDetailService; // Sử dụng service thay vì repository
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("bills") // Đường dẫn cho chi tiết hóa đơn
@CrossOrigin(origins = "http://127.0.0.1:5501")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BillDetailController {

    BillDetailService billDetailService; // Sử dụng service thay vì repository

    @GetMapping("/details/{codeBill}")
    public ApiResponse<List<BillDetailDTO>> getBillDetail(@PathVariable String codeBill) {
        log.info("Fetching bill details for bill code: {}", codeBill); // Thêm log

        List<BillDetailDTO> billDetails = billDetailService.getBillDetails(codeBill);
        log.info("Số lượng chi tiết hóa đơn: {}", billDetails.size()); // Log số lượng chi tiết hóa đơn

        return ApiResponse.<List<BillDetailDTO>>builder()
                .code(1000)
                .result(billDetails)
                .build();
    }

    @GetMapping("/detailsOnline/{codeBill}")
    public ApiResponse<List<BillDetailOnlineDTO>> getBillDetailOnline(@PathVariable String codeBill) {
        log.info("Fetching bill details for bill code: {}", codeBill); // Thêm log thông tin mã hóa đơn

        // Kiểm tra mã hóa đơn
        if (codeBill == null || codeBill.trim().isEmpty()) {
            log.warn("Mã hóa đơn không hợp lệ: {}", codeBill);
            throw new IllegalArgumentException("Mã hóa đơn không được để trống");
        }

        // Gọi service để lấy dữ liệu
        List<BillDetailOnlineDTO> billDetailsOnline = billDetailService.getBillDetailsOnline(codeBill);
        log.info("Số lượng chi tiết hóa đơn: {}",
                billDetailsOnline != null ? billDetailsOnline.size() : 0); // Log số lượng chi tiết hóa đơn

        // Trả về API response
        return ApiResponse.<List<BillDetailOnlineDTO>>builder()
                .code(1000)
                .message("Lấy chi tiết hóa đơn thành công")
                .result(billDetailsOnline)
                .build();
    }
}
