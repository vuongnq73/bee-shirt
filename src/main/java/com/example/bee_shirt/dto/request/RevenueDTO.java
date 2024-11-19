package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;


public class RevenueDTO {
    private int BillCount;          // Số hóa đơn
    private int TotalShirtQuantity; // Tổng số sản phẩm
    private BigDecimal TotalRevenue; // Doanh thu

    // Constructor, getters, setters

    public RevenueDTO(int billCount, int totalShirtQuantity, BigDecimal totalRevenue) {
        this.BillCount = billCount;
        this.TotalShirtQuantity = totalShirtQuantity;
        this.TotalRevenue = totalRevenue;
    }

    public int getBillCount() {
        return BillCount;
    }

    public void setBillCount(int billCount) {
        this.BillCount = billCount;
    }

    public int getTotalShirtQuantity() {
        return TotalShirtQuantity;
    }

    public void setTotalShirtQuantity(int totalShirtQuantity) {
        this.TotalShirtQuantity = totalShirtQuantity;
    }

    public BigDecimal getTotalRevenue() {
        return TotalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.TotalRevenue = totalRevenue;
    }     //Doanh thu
}
