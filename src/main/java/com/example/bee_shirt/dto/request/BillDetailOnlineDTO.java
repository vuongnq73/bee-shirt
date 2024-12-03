package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BillDetailOnlineDTO {
    private String codeBill;
    private Date createAt;
    private String createBy;
    private String customerName;
    private String addressCustomer;
    private String phoneNumber;
    private String nameImage;
    private String nameShirt;
    private String nameBrand;
    private String nameSize;
    private Integer quantity;
    private BigDecimal price;
    private String nameVoucher;
    private BigDecimal moneyShip;
    private Date desiredDate;
    private BigDecimal subtotalBeforeDiscount;
    private BigDecimal totalMoney;
    private String typeBill;
    private String note;
    private Integer statusBill;


}
