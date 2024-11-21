package com.example.bee_shirt.entity;

import java.io.Serializable;
import java.util.Objects;

public class BillPaymentId implements Serializable {
    private Integer bill_id;
    private Integer paymentId;

    // Constructor mặc định
    public BillPaymentId() {}

    // Getter, Setter, equals, và hashCode

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BillPaymentId that = (BillPaymentId) o;
        return Objects.equals(bill_id, that.bill_id) && Objects.equals(paymentId, that.paymentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bill_id, paymentId);
    }
}
