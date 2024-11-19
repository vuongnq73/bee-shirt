package com.example.bee_shirt.dto;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ShirtDetailDTO {
    private int id;
    private String codeShirtDetail;
    private String nameShirt;
    private BigDecimal price;
    private int quantity;
    private String pattern;
    private String gender;
    private String origin;
    private String season;
    private String size;
    private String material;
    private String color;
    private int statusshirtdetail;
    private String createBy;
    private Date createAt;
    private String updateBy;
    private Date updateAt;
    private boolean deleted;
    private int shirtId;
    private int patternId;
    private int genderId;
    private int originId;
    private int seasonId;
    private int sizeId;
    private int materialId;
    private int colorId;
}
