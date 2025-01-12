package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "dia_chi_giao_hang")
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

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "id_thanh_pho", nullable = false)
    private Integer idThanhPho;

    @Column(name = "id_huyen", nullable = false)
    private Integer idHuyen;

    @Column(name = "id_xa", nullable = false)
    private Integer idXa;

    @Column(name = "ten", nullable = false)
    private String ten;

    @Column(name = "sdt", nullable = false)
    private String sdt;

    @Column(name = "dia_chi_chi_tiet", nullable = false)
    private String diaChiChiTiet;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted;
}
