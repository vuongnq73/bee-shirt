package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cart_detail")
public class CartDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "shirt_detail_id")
    private ShirtDetail shirtDetail;

    @Column(name = "code_cart_detail", length = 50)
    private String codeCartDetail;

    @Column(name = "status_cart_detail")
    private Integer statusCartDetail;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "deleted")
    private Boolean deleted;
}
