package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.Voucher1;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.repository.VoucherRepository1;
import jakarta.persistence.PrePersist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherService1 {
    @Autowired
    private final VoucherRepository1 voucherRepository;
    public VoucherService1(VoucherRepository1 voucherRepository) {
        this.voucherRepository = voucherRepository;
    }
    public Page<Voucher1> getAllVouchers(Pageable pageable) {
        // Tạo Pageable với sắp xếp theo id giảm dần
        Pageable sortedByIdDesc = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Order.desc("id")));

        // Trả về danh sách voucher với phân trang và sắp xếp
        return voucherRepository.findAll(sortedByIdDesc);
    }


    public List<Voucher1> searchVouchers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return voucherRepository.findAll();
        }
        return voucherRepository.searchAllFields(keyword.trim());
    }


// search theo ngày tháng
public List<Voucher1> findByDateRange(LocalDateTime batdau, LocalDateTime ketthuc) {
    if (batdau == null) {
        batdau = LocalDateTime.MIN; // Ngày nhỏ nhất nếu không có
    }
    if (ketthuc == null) {
        ketthuc = LocalDateTime.MAX; // Ngày lớn nhất nếu không có
    }
    return voucherRepository.findByDateRange(batdau, ketthuc);
}

    // Phương thức kiểm tra và cập nhật trạng thái voucher
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateVoucherStatus() {
        LocalDateTime now = LocalDateTime.now();

        System.out.println("Running scheduled task: updateVoucherStatus at " + now);

        // Lấy danh sách voucher từ repository
        List<Voucher1> vouchers = voucherRepository.findAll();
        for (Voucher1 voucher : vouchers) {
            try {
                LocalDateTime startDate = voucher.getStartdate();
                LocalDateTime endDate = voucher.getEnddate();

                if (startDate.isAfter(now)) {
                    voucher.setStatus_voucher(0);  // Hết hạn
                } else if (!startDate.isAfter(now) && !endDate.isBefore(now)) {
                    voucher.setStatus_voucher(1); //  Đang hoạt động
                } else if (endDate.isBefore(now)) {
                    voucher.setStatus_voucher(2); //  Chưa kích hoạt
                }
            } catch (Exception e) {
                System.err.println("Lỗi khi xử lý voucher ID: " + voucher.getId());
                e.printStackTrace();
            }
        }
        // Lưu danh sách voucher đã cập nhật
        voucherRepository.saveAll(vouchers);
    }


    public LocalDateTime convertUTCToVietnamTime(LocalDateTime utcDateTime) {
        ZoneId vietnamZone = ZoneId.of("Asia/Ho_Chi_Minh");
        return utcDateTime.atZone(ZoneOffset.UTC).withZoneSameInstant(vietnamZone).toLocalDateTime();
    }



    public Optional<Voucher1> getVoucherById(Long id) {
        return voucherRepository.findById(id);
    }

    public Optional<Voucher1> getVoucherByCode(String code_voucher) {
        return voucherRepository.findByCode_voucher(code_voucher);
    }

    @PrePersist
    public Voucher1 saveVoucher(Voucher1 voucher) {
        if (voucher.getStartdate() != null) {
            voucher.setStartdate(voucher.getStartdate().atZone(ZoneOffset.ofHours(-7)).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime());
        }
        if (voucher.getEnddate() != null) {
            voucher.setEnddate(voucher.getEnddate().atZone(ZoneOffset.ofHours(-7)).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime());
        }
        if (voucher.getType_voucher().equals("Amount")) {
            voucher.setMaximum_discount(voucher.getDiscount_value());
        }
        voucher.setStatus_voucher(1);
        // Lưu đối tượng voucher vào cơ sở dữ liệu
        return voucherRepository.save(voucher);
    }

    public Voucher1 updateVoucher(Voucher1 voucher, Long id) {
        Voucher1 update = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        update.setStatus_voucher(voucher.getStatus_voucher());

        if(voucher.getName_voucher() != null){
            update.setName_voucher(voucher.getName_voucher());
        }
        if(voucher.getCode_voucher() != null){
            update.setCode_voucher(voucher.getCode_voucher());
        }
        if(voucher.getMin_bill_value() != null){
            update.setMin_bill_value(voucher.getMin_bill_value());
        }
        if(voucher.getMaximum_discount() != null){
            update.setMaximum_discount(voucher.getMaximum_discount());
        }
        if(voucher.getDiscount_value() != null){
            update.setDiscount_value(voucher.getDiscount_value());
        }
        if(voucher.getQuantity() != null){
            update.setQuantity(voucher.getQuantity());
        }
        if(voucher.getDescription_voucher() != null){
            update.setDescription_voucher(voucher.getDescription_voucher());
        }
        if (voucher.getStartdate() != null) {
            update.setStartdate(voucher.getStartdate().atZone(ZoneOffset.ofHours(-7)).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime());
        }
        if (voucher.getEnddate() != null) {
            update.setEnddate(voucher.getEnddate().atZone(ZoneOffset.ofHours(-7)).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime());
        }
        update.setStatus_voucher(voucher.getStatus_voucher());
        return voucherRepository.save(update);
    }

    public void deleteVoucher(Long id) {
        Voucher1 voucher1 = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        voucher1.setDeleted(true);
        voucherRepository.save(voucher1);
    }


}
