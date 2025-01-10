package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "code_cart", length = 50)
    private String codeCart;

    @Column(name = "status_cart")
    private Integer statusCart;

    @Column(name = "create_by", length = 100)
    private String createBy;

    @Column(name = "create_at")
    private LocalDate createAt;


    @Column(name = "update_by", length = 100)
    private String updateBy;

    @Column(name = "update_at")
    private LocalDate updateAt;

    @Column(name = "deleted")
    private Boolean deleted;
}

