package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BillRepo extends JpaRepository<Bill, Integer> {

    @Query(value = "SELECT bl.code_bill, " +
            "bl.customer_name, " +
            "bl.desired_date, " +
            "pm.name_paymentmethod, " +
            "bl.total_money, " +
            "bl.status_bill " +
            "FROM bill bl " +
            "JOIN bill_payment bp ON bl.id = bp.bill_id " +
            "JOIN payment_method pm ON bp.payment_method_id = pm.id " +
            "LEFT JOIN voucher v ON bl.voucher_id = v.id",
            nativeQuery = true)
    List<Object[]> findBillSummaryNative();



    @Query(value = "SELECT "
            + "COUNT(DISTINCT b.id) AS BillCount, "
            + "SUM(bd.quantity) AS TotalShirtQuantity, "
            + "SUM(DISTINCT b.total_money) AS TotalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id",
            nativeQuery = true)
    List<Object[]> findBillStatisticsNative();
}
