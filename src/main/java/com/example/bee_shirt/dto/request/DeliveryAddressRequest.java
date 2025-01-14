package com.example.bee_shirt.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryAddressRequest {
    String deliveryAddressCode;


    String accountCode;


    Integer provinceId;


    Integer districtId;


    Integer wardId;


    String province;


    String district;


    String ward;


    String name;


    String phone;


    String detailAddress;


    Boolean deleted;
}
