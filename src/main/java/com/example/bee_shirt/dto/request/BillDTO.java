package com.example.bee_shirt.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillDTO {


    private String codeBill;
    private String customerName;
    private LocalDate desiredDate;
    private String namePaymentMethod;
    private BigDecimal totalMoney;
    private Integer statusBill;

    // Constructor
    public BillDTO(String codeBill, String customerName, LocalDate desiredDate,
                   String namePaymentMethod, BigDecimal totalMoney, Integer statusBill) {
        this.codeBill = codeBill;
        this.customerName = customerName;
        this.desiredDate = desiredDate;
        this.namePaymentMethod = namePaymentMethod;
        this.totalMoney = totalMoney;
        this.statusBill = statusBill;
    }
}
