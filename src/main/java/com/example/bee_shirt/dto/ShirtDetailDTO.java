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
    private String codeShirt;
    private String nameShirt;

    private BigDecimal price;
    private int quantity;
    private String namePattern;
    private String nameGender;
    private String nameOrigin;
    private String nameSeason;
    private String nameSize;
    private String nameMaterial;
    private String nameColor;
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
    private String image;
    private String image2;
    private String image3;

}
