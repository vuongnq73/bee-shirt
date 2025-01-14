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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
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

        // Lưu đối tượng voucher vào cơ sở dữ liệu
        return voucherRepository.save(voucher);
    }

    public void deleteVoucher(Long id) {
        Voucher1 voucher1 = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        voucher1.setDeleted(true);
        voucherRepository.save(voucher1);
    }


}
