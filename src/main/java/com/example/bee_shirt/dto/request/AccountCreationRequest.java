package com.example.bee_shirt.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreationRequest {
    String code;
    @NotEmpty(message = "FIRST NAME NOT EMPTY")
    String firstName;
    @NotEmpty(message = "LAST NAME NOT EMPTY")
    String lastName;

    MultipartFile avatarFile;

    @Nullable
    @Pattern(regexp = "^(https?|ftp)://[^\s/$.?#].[^\s]*$", message = "AVATAR_URL_INVALID")
    String avatar;

    String address;
    @NotEmpty(message = "PHONE NOT EMPTY")
    @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "PHONE_INVALID")
    String phone;

    @Builder.Default
    @JsonProperty("status")
    Integer status = 0;

    @NotEmpty(message = "EMAIL NOT EMPTY")
    @Email(message = "EMAIL_INVALID")
    String email;

    @NotEmpty(message = "USERNAME NOT EMPTY")
    @Size(min = 3,message = "USERNAME_INVALID")
    String username;

    //validate password
    @NotNull(message = "PASSWORD NOT EMPTY")
    @Size(min = 5,message = "PASSWORD_INVALID")
    String pass;

    String createBy;

    List<String> role;
}
