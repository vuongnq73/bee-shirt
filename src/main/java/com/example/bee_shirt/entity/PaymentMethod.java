package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "payment_method")
public class PaymentMethod {
//    	[id] [int] IDENTITY(1,1) NOT NULL,
//	[code_paymentmethod] [varchar](50) NULL,
//            [name_paymentmethod] [nvarchar](100) NULL,
//            [status_paymentmethod] [int] NULL,
//            [note] [text] NULL,
//            [deleted] [bit] NULL,
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "code_paymentmethod", length = 50)
    private String codePaymentMethod;
    @Column(name = "name_paymentmethod", length = 100)
    private String namePaymentMethod;
    @Column(name = "status_paymentmethod")
    private Integer statusPaymentMethod;
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
    @Column(name = "deleted")
    private Boolean deleted;
    @OneToMany(mappedBy = "paymentMethod", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<BillPayment> billPayments;
}
