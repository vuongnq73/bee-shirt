package com.example.bee_shirt.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    @NotEmpty(message = "USERNAME_NOT_EMPTY")
    @Size(min = 3,message = "USERNAME_INVALID")
    String username;

    @NotEmpty(message = "PASSWORD_NOT_EMPTY")
    @Size(min = 5,message = "PASSWORD_INVALID")
    String password;
}
