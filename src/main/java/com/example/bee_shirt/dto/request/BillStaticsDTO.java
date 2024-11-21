package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BillStaticsDTO {
    private String brand;          // Tên thương hiệu
    private String shirtName;      // Tên áo
    private String size;           // Kích cỡ
    private long totalQuantitySold; // Tổng số lượng đã bán
}
