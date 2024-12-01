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

        // Kiểm tra nếu cả hai ngày đều có giá trị
        if (batdau != null && ketthuc != null && batdau.isAfter(ketthuc)) {
            return ResponseEntity.badRequest().body(Collections.emptyList()); // Trả về lỗi nếu ngày bắt đầu lớn hơn ngày kết thúc
        }

        List<Voucher1> vouchers = voucherService.findByDateRange(batdau, ketthuc);
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
        // Tìm voucher theo ID
        Optional<Voucher1> voucherOpt = voucherService.getVoucherById(id);

        if (voucherOpt.isPresent()) {
            // Lấy voucher cũ từ cơ sở dữ liệu
            Voucher1 existingVoucher = voucherOpt.get();

            // Cập nhật các trường của voucher
            existingVoucher.setCode_voucher(voucherDetails.getCode_voucher());
            existingVoucher.setName_voucher(voucherDetails.getName_voucher());
            existingVoucher.setType_voucher(voucherDetails.getType_voucher());
            existingVoucher.setDiscount_value(voucherDetails.getDiscount_value());
            existingVoucher.setQuantity(voucherDetails.getQuantity());
            existingVoucher.setMin_bill_value(voucherDetails.getMin_bill_value());
            existingVoucher.setMaximum_discount(voucherDetails.getMaximum_discount());
            existingVoucher.setStartdate(voucherDetails.getStartdate());
            existingVoucher.setEnddate(voucherDetails.getEnddate());
            existingVoucher.setStatus_voucher(voucherDetails.getStatus_voucher());
            existingVoucher.setDescription_voucher(voucherDetails.getDescription_voucher());
            existingVoucher.setUpdateAt(voucherDetails.getUpdateAt());

            // Lưu voucher đã cập nhật
            Voucher1 updatedVoucher = voucherService.saveVoucher(existingVoucher);

            // Trả về voucher đã cập nhật
            return ResponseEntity.ok(updatedVoucher);
        }

        // Nếu không tìm thấy voucher, trả về lỗi 404
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Long id) {
        if (voucherService.getVoucherById(id).isPresent()) {
            voucherService.deleteVoucher(id);
            return ResponseEntity.ok("Voucher đã được xóa thành công!");  // Thêm thông báo


            // Trả về 200 OK khi xóa thành công
        }
        return ResponseEntity.notFound().build();  // Trả về 404 nếu không tìm thấy voucher
    }


    @GetMapping("/updateVoucherStatus")
    public ResponseEntity<Void> updateVoucherStatus(@RequestParam Long voucherId) {
        // Lấy voucher từ cơ sở dữ liệu
        Voucher1 voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found with id: " + voucherId));

        // Lấy ngày hiện tại
        LocalDate currentDate = LocalDate.now();

        // Cập nhật trạng thái voucher dựa trên ngày hiện tại
        if (voucher.getStartdate().isAfter(currentDate)) {
            voucher.setStatus_voucher(2); // Trạng thái "Sắp hoạt động"
        } else if (voucher.getEnddate().isBefore(currentDate)) {
            voucher.setStatus_voucher(0); // Trạng thái "Ngưng hoạt động"
        } else {
            voucher.setStatus_voucher(1); // Trạng thái "Hoạt động"
        }

        // Lưu lại trạng thái mới
        voucherRepository.save(voucher);
        return ResponseEntity.ok().build();
    }

}
