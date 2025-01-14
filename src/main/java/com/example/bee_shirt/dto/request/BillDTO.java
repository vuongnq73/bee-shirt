package com.example.bee_shirt.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillDTO {


    private String codeBill;
    private String customerName;
    private String phoneNumber;   // Trường mới
    private String typeBill;      // Trường mới
    private LocalDate createAt;
    private String namePaymentMethod;
    private BigDecimal totalMoney;
    private Integer statusBill;
    private String note;

    // Constructor
    public BillDTO(String codeBill, String customerName,String phoneNumber , String typeBill, LocalDate createAt,
                   String namePaymentMethod, BigDecimal totalMoney, Integer statusBill,String note) {
        this.codeBill = codeBill;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;  // Trư��ng mới
        this.typeBill = typeBill;  // Trư�ng mới
        this.createAt = createAt;
        this.namePaymentMethod = namePaymentMethod;
        this.totalMoney = totalMoney;
        this.statusBill = statusBill;
        this.note = note;
    }
}
