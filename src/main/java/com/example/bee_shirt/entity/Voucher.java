package com.example.bee_shirt.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Table(name = "Voucher")
@Entity
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String codeVoucher;
    private String typeVoucher;
    private String nameVoucher;
    private Double discountValue;
    private Integer quantity;
    private Double minBillValue;
    private Double maximumDiscount;

    private Date startdate;
    private Date enddate;
    private Integer statusVoucher;
    private String descriptionVoucher;
    private String createBy;
    private Date createAt;
    private Date updateAt;
}