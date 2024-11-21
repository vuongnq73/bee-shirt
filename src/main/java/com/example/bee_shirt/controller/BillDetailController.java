package com.example.bee_shirt.controller;


import com.example.bee_shirt.dto.request.BillDetailDTO;
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
@CrossOrigin(origins = "http://127.0.0.1:5500")
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
}
