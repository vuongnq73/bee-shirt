package com.example.bee_shirt.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
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
    String firstName;

    String lastName;

    String avatar;

    String address;

    String phone;

    Integer status;

    LocalDate updateAt;

    String updateBy;

    String email;

    MultipartFile avatarFile;

    @Size(min = 3,message = "USERNAME_INVALID")
    String username;

    //validate password
    @Size(min = 5,message = "PASSWORD_INVALID")
    String pass;

    List<Integer> role;
}
