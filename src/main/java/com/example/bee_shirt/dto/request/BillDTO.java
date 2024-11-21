package com.example.bee_shirt.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillDTO {

        private String codeBill;
        private LocalDate desiredDate;
        private BigDecimal totalMoney;
        private Integer statusBill;

        // Constructor, getters và setters
        public BillDTO(String codeBill, LocalDate desiredDate, BigDecimal totalMoney, Integer statusBill) {
            this.codeBill = codeBill;
            this.desiredDate = desiredDate;
            this.totalMoney = totalMoney;
            this.statusBill = statusBill;
        }

}
