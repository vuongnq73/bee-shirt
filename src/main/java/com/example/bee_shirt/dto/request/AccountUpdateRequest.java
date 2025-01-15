package com.example.bee_shirt.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountUpdateRequest {
    String code;

    String firstName;

    String lastName;

    MultipartFile avatarFile;

    @Nullable
    @Pattern(regexp = "^(https?|ftp)://[^\s/$.?#].[^\s]*$", message = "AVATAR_URL_INVALID")
    String avatar;

    @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "PHONE_INVALID")
    String phone;

    Integer status;

    Boolean deleted;

    String email;

    String username;

    //validate password
    @Size(min = 5,message = "PASSWORD_INVALID")
    String pass;

    String oldPassword;

    String createBy;

    List<String> role;
}
