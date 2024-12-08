package com.example.bee_shirt.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Table(name = "bill_detail")
@Entity
public class BillDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "shirt_detail_id")
    private ShirtDetail shirtDetail;

    @Column(name = "code_bill_detail", length = 50)
    private String codeBillDetail;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;
    @Column(name = "status_bill_detail")
    private Integer statusBillDetail;

    @Column(name = "deleted")
    private Boolean deleted;
    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bill;
}
