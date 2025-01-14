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
public class DeliveryAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "delivery_address_code", nullable = false)
    private String deliveryAddressCode;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "id_province", nullable = false)
    private Integer idProvince;

    @Column(name = "id_district", nullable = false)
    private Integer idDistrict;

    @Column(name = "id_ward", nullable = false)
    private Integer idWard;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "detail_address", nullable = false)
    private String detailAddress;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted;
}
