package com.example.bee_shirt.dto;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ColorGroupDTO {
    private String codeColor;
    private String colorName;
    private List<OnlineColorDTO> variants;  // Các biến thể theo màu này (size, quantity, price, etc.)

}
