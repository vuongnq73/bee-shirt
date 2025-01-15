package com.example.bee_shirt.controller;

import com.example.bee_shirt.entity.Voucher1;
import com.example.bee_shirt.exception.ResourceNotFoundException;
import com.example.bee_shirt.repository.VoucherRepository1;
import com.example.bee_shirt.service.VoucherService1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/voucher")
@CrossOrigin(origins = "http://127.0.0.1:5501")

public class VoucherController1 {
    @Autowired
    private VoucherService1 voucherService;
    @Autowired
    private VoucherRepository1 voucherRepository;


    @GetMapping("/list")
    public ResponseEntity<Page<Voucher1>> getAllVouchers(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        // Tạo Pageable từ các tham số yêu cầu
        Pageable pageable = PageRequest.of(page, size);

        // Gọi service để lấy danh sách voucher có phân trang và sắp xếp
        Page<Voucher1> vouchers = voucherService.getAllVouchers(pageable);

        return ResponseEntity.ok(vouchers);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Voucher1>> searchVouchers(@RequestParam("keyword") String keyword) {
        List<Voucher1> vouchers = voucherService.searchVouchers(keyword);
        return ResponseEntity.ok(vouchers);
    }

    @GetMapping("/searchByDateRange")
    public ResponseEntity<List<Voucher1>> searchByDateRange(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate batdau,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ketthuc) {

        LocalDateTime batdauDateTime = null;
        LocalDateTime ketthucDateTime = null;

        // Chuyển LocalDate thành LocalDateTime (thêm thời gian mặc định)
        if (batdau != null) {
            batdauDateTime = batdau.atStartOfDay(); // Chuyển thành LocalDateTime với thời gian là 00:00:00
        }

        if (ketthuc != null) {
            ketthucDateTime = ketthuc.atTime(23, 59, 59); // Chuyển thành LocalDateTime với thời gian là 23:59:59
        }

        // Kiểm tra nếu cả hai ngày đều có giá trị và ngày bắt đầu lớn hơn ngày kết thúc
        if (batdauDateTime != null && ketthucDateTime != null && batdauDateTime.isAfter(ketthucDateTime)) {
            return ResponseEntity.badRequest().body(Collections.emptyList()); // Trả về lỗi nếu ngày bắt đầu lớn hơn ngày kết thúc
        }

        // Gọi phương thức tìm kiếm với LocalDateTime
        List<Voucher1> vouchers = voucherService.findByDateRange(batdauDateTime, ketthucDateTime);
        return ResponseEntity.ok(vouchers);
    }




    @GetMapping("/detail/{code_voucher}")
    public ResponseEntity<Voucher1> getVoucherByCode(@PathVariable String code_voucher) {
        Optional<Voucher1> voucher = voucherService.getVoucherByCode(code_voucher);
        return voucher.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/detaill/{id}")
    public ResponseEntity<Voucher1> getVoucherById(@PathVariable Long id) {
        Optional<Voucher1> voucher = voucherService.getVoucherById(id);
        return voucher.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public Voucher1 addVoucher(@RequestBody Voucher1 voucher) {
        // Khi gửi yêu cầu, code_voucher sẽ tự động được tạo ra ở phía server.
        return voucherService.saveVoucher(voucher);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Voucher1> updateVoucher(@PathVariable Long id, @RequestBody Voucher1 voucherDetails) {
            return ResponseEntity.ok(voucherService.updateVoucher(voucherDetails,id));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Long id) {
        if (voucherService.getVoucherById(id).isPresent()) {
            voucherService.deleteVoucher(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Voucher đã được xóa thành công!"));
        }
        return ResponseEntity.notFound().build();
    }



    @GetMapping("/updateVoucherStatus")
    public ResponseEntity<Void> updateVoucherStatus(@RequestParam Long voucherId) {
        // Lấy voucher từ cơ sở dữ liệu
        Voucher1 voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + voucherId));

        // Lấy ngày hiện tại
        LocalDate currentDate = LocalDate.now();

        // Cập nhật trạng thái voucher dựa trên ngày hiện tại
        if (voucher.getStartdate().isAfter(ChronoLocalDateTime.from(currentDate))) {
            voucher.setStatus_voucher(2); // Trạng thái "Sắp hoạt động"
        } else if (voucher.getEnddate().isBefore(ChronoLocalDateTime.from(currentDate))) {
            voucher.setStatus_voucher(0); // Trạng thái "Ngưng hoạt động"
        } else {
            voucher.setStatus_voucher(1); // Trạng thái "Hoạt động"
        }

        // Lưu lại trạng thái mới
        voucherRepository.save(voucher);
        return ResponseEntity.ok().build();
    }

}
