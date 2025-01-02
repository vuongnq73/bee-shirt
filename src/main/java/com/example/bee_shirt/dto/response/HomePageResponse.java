package com.example.bee_shirt.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomePageResponse {
    Integer idShirt;
    String nameImage;
    String nameShirt;
    String branch;
    String size;
    String color;
    BigDecimal price;
}
