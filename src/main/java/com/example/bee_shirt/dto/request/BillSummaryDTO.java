package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BillSummaryDTO {
    private Integer totalOrderInStore;
    private Integer totalOrderOnline;
    private Integer billCount;
    private Integer totalShirtQuantity;
    private BigDecimal totalRevenue;
    private BigDecimal TotalOnlineMoney;
    private BigDecimal TotalInstoreMoney;
}
