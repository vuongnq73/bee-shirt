package com.example.bee_shirt.dto.request;

import jakarta.validation.constraints.NotEmpty;
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
public class RoleRequest {
    @NotEmpty(message = "Code cannot be empty")
    String code;

    String name;

    Integer status;

    String description;

    LocalDate createAt;

    String createBy;

    LocalDate updateAt;

    String updateBy;
}
