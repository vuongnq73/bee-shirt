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
public List<Voucher1> findByDateRange(LocalDate batdau, LocalDate ketthuc) {
    if (batdau == null) {
        batdau = LocalDate.MIN; // Ngày nhỏ nhất nếu không có
    }
    if (ketthuc == null) {
        ketthuc = LocalDate.MAX; // Ngày lớn nhất nếu không có
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
        return voucherRepository.save(voucher);
    }

    public void deleteVoucher(Long id) {
        voucherRepository.deleteById(id);
    }




}
