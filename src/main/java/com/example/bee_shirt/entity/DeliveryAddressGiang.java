package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "delivery_address")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeliveryAddressGiang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "delivery_address_code")
    private String deliveryAddressCode;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "id_province")
    private Integer provinceId;

    @Column(name = "id_district")
    private Integer districtId;

    @Column(name = "id_ward")
    private Integer wardId;

    @Column(name = "province")
    private String province;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "detail_address")
    private String detailAddress;

    @Column(name = "deleted")
    private Boolean deleted;

}
