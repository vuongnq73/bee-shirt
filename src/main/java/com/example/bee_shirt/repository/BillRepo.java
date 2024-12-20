package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.request.BillSummaryDTO;
import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface BillRepo extends JpaRepository<Bill, Integer> {
//trạng thasi đã hoàn tất
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
            "WHERE bl.status_bill = 6" +
            "ORDER BY bl.id DESC",
            nativeQuery = true)
    List<Object[]> findBillSummaryNative();
    //listBill có trạngthaisis là chờ xử lý
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
            "WHERE bl.status_bill IN (1, 2, 3, 4, 5) AND bl.type_bill = 'Online' " +
            "ORDER BY bl.id DESC",
            nativeQuery = true)
    List<Object[]> findBillSummaryNative2();


    //listBill có trạngthai status_bill = đã hủy
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
            "WHERE bl.status_bill = 7" +
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
    //
    Optional<Bill> findByCodeBill(String codeBill);
    //
    @Query(value = """
    SELECT 
        -- Tổng số bill loại In-Store
        (SELECT COUNT(DISTINCT b.id)
         FROM bill b
         WHERE b.type_bill = 'In-Store' 
           AND b.create_at BETWEEN :startDate AND :endDate
           AND b.status_bill = 6) AS totalOrderInStore,

        -- Tổng số bill loại Online
        (SELECT COUNT(DISTINCT b.id)
         FROM bill b
         WHERE b.type_bill = 'Online' 
           AND b.create_at BETWEEN :startDate AND :endDate
           AND b.status_bill = 6) AS totalOrderOnline,

        -- Tổng số bill (duy nhất)
        COUNT(DISTINCT b.id) AS BillCount,

        -- Tổng số lượng áo bán được
        SUM(bd.quantity) AS TotalShirtQuantity,

        -- Tổng doanh thu
        SUM(b.total_money) AS TotalRevenue,

        -- Tổng doanh thu loại In-Store
        SUM(CASE WHEN b.type_bill = 'In-Store' THEN b.total_money ELSE 0 END) AS TotalInstoreMoney,

        -- Tổng doanh thu loại Online
        SUM(CASE WHEN b.type_bill = 'Online' THEN b.total_money ELSE 0 END) AS TotalOnlineMoney

    FROM bill b
    LEFT JOIN bill_detail bd ON b.id = bd.bill_id
    WHERE b.create_at BETWEEN :startDate AND :endDate
      AND b.status_bill = 6
""", nativeQuery = true)
    List<Object[]> getBillSummaryRaw(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    //
    // danh sách đơn mua hàng phía client có trạng thái là chờ xử lý
    @Query(value = "SELECT code_bill, create_date, total_money, status_bill " +
            "FROM bill " +
            "WHERE customer_id = :customerId AND status_bill IN (1, 2) " +
            "ORDER BY create_date DESC",
            nativeQuery = true)
    List<Object[]> findByCustomerIdAndStatusNative(@Param("customerId") Integer customerId);
    // danh sách đơn mua hàng phía client có trạng thái là Chờ giao hàng
    @Query(value = "SELECT code_bill, create_date, total_money, status_bill " +
            "FROM bill " +
            "WHERE customer_id = :customerId AND status_bill = 3 " +
            "ORDER BY create_date DESC",
            nativeQuery = true)
    List<Object[]> findByCustomerIdAndStatusNative2(@Param("customerId") Integer customerId);
    // danh sách đơn mua hàng phía client có trạng thái là dang gaio hàng
    @Query(value = "SELECT code_bill, create_date, total_money, status_bill " +
            "FROM bill " +
            "WHERE customer_id = :customerId AND status_bill = 4 " +
            "ORDER BY create_date DESC",
            nativeQuery = true)
    List<Object[]> findByCustomerIdAndStatusNative3(@Param("customerId") Integer customerId);
    // danh sách đơn mua hàng phía client có trạng thái là hoàn tất
    @Query(value = "SELECT code_bill, create_date, total_money, status_bill " +
            "FROM bill " +
            "WHERE customer_id = :customerId AND status_bill IN (5, 6) " +
            "ORDER BY create_date DESC",
            nativeQuery = true)
    List<Object[]> findByCustomerIdAndStatusNative4(@Param("customerId") Integer customerId);
    // danh sách đơn mua hàng phía client có trạng thái là dã hủy
    @Query(value = "SELECT code_bill, create_date, total_money, status_bill " +
            "FROM bill " +
            "WHERE customer_id = :customerId AND status_bill = 7 " +
            "ORDER BY create_date DESC",
            nativeQuery = true)
    List<Object[]> findByCustomerIdAndStatusNative5(@Param("customerId") Integer customerId);
}
