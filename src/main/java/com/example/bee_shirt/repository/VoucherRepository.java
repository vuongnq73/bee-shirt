package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.ShirtDetail;
import com.example.bee_shirt.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query("SELECT v FROM Voucher v WHERE v.codeVoucher LIKE :query")
    Voucher findVoucherByCode(String query);

}
