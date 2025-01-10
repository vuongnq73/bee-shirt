package com.example.bee_shirt.dto;

import lombok.*;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OnlineShirtDTO {
    private String codeBrand;
    private String nameBrand;
    private String codeCategory;
    private String nameCategory;
    private String codeshirt;
    private String nameshirt;
    private String description;
}
