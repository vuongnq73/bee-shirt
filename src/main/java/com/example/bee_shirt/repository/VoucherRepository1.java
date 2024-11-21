package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Voucher1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VoucherRepository1 extends JpaRepository<Voucher1, Long> {

    @Query("SELECT v FROM  Voucher1 v WHERE v.code_voucher = :code")
    Optional<Voucher1> findByCode_voucher(@Param("code") String code);

    // Tìm tất cả voucher có enddate nhỏ hơn ngày hiện tại
    List<Voucher1> findByEnddateBefore(LocalDate currentDate);

    @Query("SELECT v FROM Voucher1 v " +
            "WHERE LOWER(v.code_voucher) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(v.type_voucher) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(v.name_voucher) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR CAST(v.discount_value AS string) LIKE CONCAT('%', :keyword, '%') " +
            "OR CAST(v.quantity AS string) LIKE CONCAT('%', :keyword, '%') " +
            "OR CAST(v.min_bill_value AS string) LIKE CONCAT('%', :keyword, '%') " +
            "OR CAST(v.maximum_discount AS string) LIKE CONCAT('%', :keyword, '%') " +
            "OR LOWER(CAST(v.startdate AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(CAST(v.enddate AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR CAST(v.status_voucher AS string) LIKE CONCAT('%', :keyword, '%')")
    List<Voucher1> searchAllFields(@Param("keyword") String keyword);

    @Query("SELECT v FROM Voucher1 v WHERE v.startdate >= :batdau AND v.enddate <= :ketthuc")
    List<Voucher1> findByDateRange(@Param("batdau") LocalDate batdau, @Param("ketthuc") LocalDate ketthuc);



}
