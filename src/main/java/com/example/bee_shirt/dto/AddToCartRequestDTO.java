package com.example.bee_shirt.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AddToCartRequestDTO {
    private Integer cartId;
    private Integer shirtDetailId;
    private Integer statusCartDetail;
}
