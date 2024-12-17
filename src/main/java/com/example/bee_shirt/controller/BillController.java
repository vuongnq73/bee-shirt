package com.example.bee_shirt.controller;


import com.example.bee_shirt.dto.request.*;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.entity.Bill;
import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.repository.BillDetailrepo;
import com.example.bee_shirt.repository.BillPaymentRepo;
import com.example.bee_shirt.repository.BillRepo;
import com.example.bee_shirt.service.BillService;
import com.example.bee_shirt.service.BillStaticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController

@RequestMapping("bills") // Đường dẫn theo kiểu RESTful
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BillController {

    BillRepo billrepo;
    BillPaymentRepo billpaymentrepo;
    BillDetailrepo billDetailrepo;
    private final BillService billService;
    private final BillStaticsService billStaticsService;

    @GetMapping("/history") // Đổi đường dẫn cho lịch sử hóa đơn
    public ApiResponse<List<BillHistoryDTO>> getBillHistory() {
        List<Bill> bills = billrepo.findAll();
        log.info("Số lượng lịch sử hóa đơn: {}", bills.size()); // Thêm log
        List<BillHistoryDTO> response = bills.stream()
                .map(bill -> new BillHistoryDTO(bill.getCodeBill(), bill.getDesiredDate(), bill.getTotalMoney(), bill.getStatusBill()))
                .collect(Collectors.toList());
        return ApiResponse.<List<BillHistoryDTO>>builder()
                .code(1000)
                .result(response)
                .build();
    }


    @GetMapping("/list")
    public ApiResponse<List<BillDTO>> getBillList() {
        List<BillDTO> bills = billService.getAllBillSummaries();
        log.info("Số lượng hóa đơn: {}", bills.size());

        return ApiResponse.<List<BillDTO>>builder()
                .code(1000)
                .result(bills)
                .build();
    }
    //List bill có trạng thái là 2
    @GetMapping("/list2")
    public ApiResponse<List<BillDTO>> getBillList2() {
        List<BillDTO> bills = billService.getAllBillSummaries2();
        log.info("Số lượng hóa đơn list 2: {}", bills.size());

        return ApiResponse.<List<BillDTO>>builder()
                .code(1000)
                .result(bills)
                .build();
    }
    //List bill có trạng thái là 3
    @GetMapping("/list3")
    public ApiResponse<List<BillDTO>> getBillList3() {
        List<BillDTO> bills = billService.getAllBillSummaries3();
        log.info("Số lượng hóa đơn list 3: {}", bills.size());

        return ApiResponse.<List<BillDTO>>builder()
                .code(1000)
                .result(bills)
                .build();
    }
    //Api Thong ke san pham ban chay

    @GetMapping("/statics")
    public ApiResponse<List<BillStaticsDTO>> getAllBillStatics() {
        // Truyền các tham số động nhận từ API vào service
        List<BillStaticsDTO> statisticsAll = billStaticsService.getAllBillStatics();
        log.info("Number of statistics records found: {}", statisticsAll.size());
        return ApiResponse.<List<BillStaticsDTO>>builder()
                .code(1000)
                .result(statisticsAll)
                .build();
    }
;
    @GetMapping("/statics/revenue")
    public ApiResponse<List<RevenueDTO>> getBillStatics() {
        // Truyền các tham số động nhận từ API vào service
        List<RevenueDTO> statisticsAll = billService.getAllBillStatics(); // Đảm bảo gọi phương thức đúng
        log.info("Number of statistics records found: {}", statisticsAll.size());

        return ApiResponse.<List<RevenueDTO>>builder() // Sử dụng RevenueDTO thay vì BillStaticsDTO
                .code(1000)
                .result(statisticsAll)
                .build();
    }

//
@PutMapping("/updateStatus")
public ResponseEntity<Void> updateStatus(@RequestBody BillStatusUpdateRequest request) {
    System.out.println("Received request: " + request);
    String codeBill = request.getCodeBill();
    int statusBill = request.getStatusBill();
    // Kiểm tra xem các trường này có hợp lệ không
    if (codeBill == null || codeBill.isEmpty() || statusBill < 0) {
        return ResponseEntity.badRequest().build(); // Trả về lỗi 400 nếu dữ liệu không hợp lệ
    }

    if (billService.updateStatus(codeBill, statusBill)) {
        return ResponseEntity.noContent().build(); // Thành công
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Không tìm thấy hóa đơn
    }
}




}
