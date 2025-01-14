package com.example.bee_shirt.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    String token;
    boolean authenticated;
}
