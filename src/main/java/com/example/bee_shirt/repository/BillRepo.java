package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BillRepo extends JpaRepository<Bill, Integer> {

    @Query(value = "SELECT bl.code_bill, " +
            "       bl.customer_name, " +
            "       bl.phone_number, " +
            "       bl.type_bill, " +
            "       bl.create_at, " +
            "       pm.name_paymentmethod, " +
            "       bl.total_money, " +
            "       bl.status_bill " +
            "FROM bill bl " +
            "LEFT JOIN bill_payment bp ON bl.id = bp.bill_id " +
            "LEFT JOIN payment_method pm ON bp.payment_method_id = pm.id " +
            "WHERE bl.status_bill = 1" +
            "ORDER BY bl.id DESC",
            nativeQuery = true)
    List<Object[]> findBillSummaryNative();
    //listBill có trạngthaisis là 2
    @Query(value = "SELECT bl.code_bill, " +
            "       bl.customer_name, " +
            "       bl.phone_number, " +
            "       bl.type_bill, " +
            "       bl.create_at, " +
            "       pm.name_paymentmethod, " +
            "       bl.total_money, " +
            "       bl.status_bill " +
            "FROM bill bl " +
            "LEFT JOIN bill_payment bp ON bl.id = bp.bill_id " +
            "LEFT JOIN payment_method pm ON bp.payment_method_id = pm.id " +
            "WHERE bl.status_bill = 2" +
            "ORDER BY bl.id DESC",
            nativeQuery = true)
    List<Object[]> findBillSummaryNative2();

    //listBill có trạngthai status_bill = 3
    @Query(value = "SELECT bl.code_bill, " +
            "       bl.customer_name, " +
            "       bl.phone_number, " +
            "       bl.type_bill, " +
            "       bl.create_at, " +
            "       pm.name_paymentmethod, " +
            "       bl.total_money, " +
            "       bl.status_bill " +
            "FROM bill bl " +
            "LEFT JOIN bill_payment bp ON bl.id = bp.bill_id " +
            "LEFT JOIN payment_method pm ON bp.payment_method_id = pm.id " +
            "WHERE bl.status_bill = 3" +
            "ORDER BY bl.id DESC",
            nativeQuery = true)
    List<Object[]> findBillSummaryNative3();





    @Query(value = "SELECT "
            + "COUNT(DISTINCT b.id) AS BillCount, "
            + "SUM(bd.quantity) AS TotalShirtQuantity, "
            + "SUM(b.total_money) AS TotalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE CONVERT(DATE, b.create_at) = CONVERT(DATE, GETDATE())",
            nativeQuery = true)
    List<Object[]> findBillStatisticsNative();

}
