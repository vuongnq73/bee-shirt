package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.Voucher1;
import com.example.bee_shirt.repository.VoucherRepository1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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



    public Optional<Voucher1> getVoucherById(Long id) {
        return voucherRepository.findById(id);
    }
    public Optional<Voucher1> getVoucherByCode(String code_voucher) {
        return voucherRepository.findByCode_voucher(code_voucher);
    }
    public Voucher1 saveVoucher(Voucher1 voucher) {

        // Chuyển đổi startdate và enddate từ UTC sang GMT+7
        ZonedDateTime startDateTime = ZonedDateTime.parse(voucher.getStartdate().toString())
                .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"));
        ZonedDateTime endDateTime = ZonedDateTime.parse(voucher.getEnddate().toString())
                .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"));

        // Cập nhật thời gian trong voucher
        voucher.setStartdate(startDateTime.toLocalDateTime());
        voucher.setEnddate(endDateTime.toLocalDateTime());

        // Lưu voucher vào cơ sở dữ liệu

        return voucherRepository.save(voucher);
    }


    // Phương thức chuyển đổi ngày giờ và múi giờ
    public ZonedDateTime convertToLocalDateTimeWithTimeZone(String dateStr) {
        try {
            // Chuẩn hóa chuỗi nếu thiếu giây
            if (dateStr.length() == 16) {
                dateStr += ":00"; // Thêm giây nếu thiếu
            }

            // Bổ sung múi giờ nếu chuỗi không chứa múi giờ
            if (!dateStr.contains("Z") && !dateStr.contains("+") && !dateStr.contains("-")) {
                dateStr += "Z"; // Mặc định bổ sung UTC nếu không có múi giờ
            }

            // Định dạng ISO cho ngày giờ với múi giờ
            DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(dateStr, formatter);

            // Chuyển đổi sang múi giờ Asia/Ho_Chi_Minh
            return zonedDateTime.withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"));
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format: " + dateStr, e);
        }
    }



    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }




}
