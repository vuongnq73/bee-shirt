package com.example.bee_shirt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShirtResponseDTO {
    private int id;
    private String codeshirt;
    private String nameshirt;
    private String createBy;
    private String updateBy;
    private Date createAt;
    private Date updateAt;
    private int statusshirt;
    private String nameBrand;
    private String nameCategory;
    private int categoryId;
    private int brandId;
    private boolean deleted;
    private long quantity;
}
