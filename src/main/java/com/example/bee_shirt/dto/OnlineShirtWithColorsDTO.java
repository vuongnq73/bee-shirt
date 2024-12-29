package com.example.bee_shirt.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OnlineShirtWithColorsDTO {
    private String codeBrand;
    private String nameBrand;
    private String codeCategory;
    private String nameCategory;
    private String codeShirt;
    private String nameShirt;
    private String description;
    private List<ColorGroupDTO> colorGroups;


}
