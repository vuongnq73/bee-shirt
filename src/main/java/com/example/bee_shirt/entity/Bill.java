package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "bill")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "voucher_id")
    private Integer voucherId;

    @Column(name = "account_id")
    private Integer accountId;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "code_bill", length = 50)
    private String codeBill;

    @Column(name = "type_bill", length = 100)
    private String typeBill;

    @Column(name = "customer_name", length = 250)
    private String customerName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "address_customer", columnDefinition = "TEXT")
    private String addressCustomer;

    @Column(name = "money_ship", precision = 10, scale = 2)
    private BigDecimal moneyShip;

    @Column(name = "subtotal_before_discount", precision = 10, scale = 2)
    private BigDecimal subtotalBeforeDiscount;

    @Column(name = "money_reduce", precision = 10, scale = 2)
    private BigDecimal moneyReduce;

    @Column(name = "total_money", precision = 10, scale = 2)
    private BigDecimal totalMoney;

    @Column(name = "create_date")
    private LocalDate createDate;

    @Column(name = "desired_date")
    private LocalDate desiredDate;

    @Column(name = "status_bill")
    private Integer statusBill;

    @Column(name = "create_by", length = 100)
    private String createBy;

    @Column(name = "create_at")
    private LocalDate createAt;

    @Column(name = "update_by", length = 100)
    private String updateBy;

    @Column(name = "update_at")
    private LocalDate updateAt;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "bill_id")
    private List<BillDetail> billDetails;
}
