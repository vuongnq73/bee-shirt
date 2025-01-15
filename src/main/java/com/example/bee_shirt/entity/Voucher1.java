package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "voucher")
public class Voucher1 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "code_voucher")
    private String code_voucher;
    // Tạo mã voucher tự động trước khi lưu
    @PrePersist
    public void generateCodeVoucher() {
        if (this.code_voucher == null || this.code_voucher.isEmpty()) {
            this.code_voucher = "VOUCHER" + System.currentTimeMillis();  // Tạo mã voucher duy nhất bằng thời gian hệ thống
        }
    }

    @Column(name = "type_voucher")
    private String type_voucher;
    @Column(name = "name_voucher")
    private String name_voucher;

    @Column(name = "discount_value")
    private Double discount_value;
    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "min_bill_value")
    private Double min_bill_value;
    @Column(name = "maximum_discount")
    private Double maximum_discount;

    @Column(name = "startdate")
    private LocalDateTime startdate;
    @Column(name = "enddate")
    private LocalDateTime enddate;
//    public LocalDateTime getEnddate() {
//        return enddate == null ? LocalDateTime.now() : enddate;  // Trả về ngày tối đa nếu enddate là null
//    }
    @Column(name = "status_voucher")
    private int status_voucher;
    @Column(name = "description_voucher")
    private String description_voucher;
    @Column(name = "create_by")
    private String createby;
    @Column(name = "create_at")
    private LocalDateTime createAt;
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    @Column(name = "deleted")
    private boolean deleted = false;
}
