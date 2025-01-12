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
import com.example.bee_shirt.service.lmp.ShirtDetailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final  ShirtDetailService shirtDetailService;
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
    String note= request.getNote();
    // Kiểm tra xem các trường này có hợp lệ không
    if (codeBill == null || codeBill.isEmpty() || statusBill < 0) {
        return ResponseEntity.badRequest().build(); // Trả về lỗi 400 nếu dữ liệu không hợp lệ
    }

    if (billService.updateStatus(codeBill, statusBill,note)) {
        return ResponseEntity.noContent().build(); // Thành công
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Không tìm thấy hóa đơn
    }
}
//
// API cập nhật số lượng sản phẩm trong kho khi trạng thái bill = 6



    @PutMapping("/updateStock/{codeBill}")
    public ResponseEntity<Map<String, String>> updateQuantity(@PathVariable("codeBill") String codeBill) {
        Map<String, String> response = new HashMap<>();
        try {
            shirtDetailService.updateQuantityByCodeBill(codeBill);
            response.put("message", "Quantity updated successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log lỗi để kiểm tra nguyên nhân
            e.printStackTrace();  // In chi tiết lỗi ra console
            response.put("error", "An error occurred while updating the quantity: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/date-range")
    public ApiResponse<List<Map<String, Object>>> getBillsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        try {
            // Lấy danh sách hóa đơn theo khoảng thời gian
            List<Map<String, Object>> bills = billService.getBillsByDateRange(startDate, endDate);

            // Trả về ApiResponse với mã code và kết quả
            return ApiResponse.<List<Map<String, Object>>>builder()
                    .code(1000)  // Mã code thành công
                    .result(bills)  // Kết quả trả về là danh sách hóa đơn (dạng Map)
                    .build();
        } catch (Exception e) {
            // Trả về ApiResponse với mã code lỗi khi có exception xảy ra
            return ApiResponse.<List<Map<String, Object>>>builder()
                    .code(500)  // Mã lỗi 500 cho server error
                    .result(null)  // Không có kết quả trả về
                    .build();
        }
    }
//    lọc cho tab2
@GetMapping("/date-range2")
public ApiResponse<List<Map<String, Object>>> getBillsByDateRange2(
        @RequestParam("startDate") String startDate,
        @RequestParam("endDate") String endDate) {
    try {
        // Lấy danh sách hóa đơn theo khoảng thời gian
        List<Map<String, Object>> bills = billService.getBillsByDateRange2(startDate, endDate);

        // Trả về ApiResponse với mã code và kết quả
        return ApiResponse.<List<Map<String, Object>>>builder()
                .code(1000)  // Mã code thành công
                .result(bills)  // Kết quả trả về là danh sách hóa đơn (dạng Map)
                .build();
    } catch (Exception e) {
        // Trả về ApiResponse với mã code lỗi khi có exception xảy ra
        return ApiResponse.<List<Map<String, Object>>>builder()
                .code(500)  // Mã lỗi 500 cho server error
                .result(null)  // Không có kết quả trả về
                .build();
    }
}

    //    lọc cho tab3
    @GetMapping("/date-range3")
    public ApiResponse<List<Map<String, Object>>> getBillsByDateRange3(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        try {
            // Lấy danh sách hóa đơn theo khoảng thời gian
            List<Map<String, Object>> bills = billService.getBillsByDateRange3(startDate, endDate);

            // Trả về ApiResponse với mã code và kết quả
            return ApiResponse.<List<Map<String, Object>>>builder()
                    .code(1000)  // Mã code thành công
                    .result(bills)  // Kết quả trả về là danh sách hóa đơn (dạng Map)
                    .build();
        } catch (Exception e) {
            // Trả về ApiResponse với mã code lỗi khi có exception xảy ra
            return ApiResponse.<List<Map<String, Object>>>builder()
                    .code(500)  // Mã lỗi 500 cho server error
                    .result(null)  // Không có kết quả trả về
                    .build();
        }
    }


}
