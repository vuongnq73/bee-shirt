package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "bill_payment")

public class BillPayment {
    @Id
    private Integer bill_payment_id;
    @Column(name = "payment_amount", precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    @Column(name = "deleted")
    private Boolean deleted;

    @ManyToOne
   @JoinColumn(name="payment_method_id")  // Map paymentId như cả khóa chính và khóa ngoại
    private PaymentMethod paymentMethod;

    @ManyToOne
    @JoinColumn(name="bill_id")    // Map bill_id như cả khóa chính và khóa ngoại
    private Bill bill;


}
