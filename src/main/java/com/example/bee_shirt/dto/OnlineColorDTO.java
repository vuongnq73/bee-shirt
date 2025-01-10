package com.example.bee_shirt.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OnlineColorDTO {
    private String codeshirt;
    private String codeColor;
    private String nameColor;
    private String codeSize;
    private String namesize;
    private String image;
    private String image2;
    private String image3;
    private String nameMaterial;
    private Integer quantity;
    private BigDecimal price;
    private Integer id;

}
