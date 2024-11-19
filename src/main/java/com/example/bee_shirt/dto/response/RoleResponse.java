package com.example.bee_shirt.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {
    Integer id;

    String code;

    String name;

    Integer status;

    String description;

    LocalDate createAt;

    String createBy;

    LocalDate updateAt;

    String updateBy;
}
