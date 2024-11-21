package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("SELECT b FROM Bill b WHERE b.codeBill LIKE :query")
    Bill findBillByCode(String query);

    @Query("SELECT b FROM Bill b WHERE b.statusBill = 0")

    List<Bill> findPendingBill();
//    @Query(value = "SELECT bl.code_bill, " +
//            "bl.customer_name, " +
//            "bl.desired_date, " +
//            "pm.name_paymentmethod, " +
//            "bl.total_money, " +
//            "bl.status_bill " +
//            "FROM bill bl " +
//            "JOIN bill_payment bp ON bl.id = bp.bill_id " +
//            "JOIN payment_method pm ON bp.payment_method_id = pm.id " +
//            "LEFT JOIN voucher v ON bl.voucher_id = v.id",
//            nativeQuery = true)
//    List<Object[]> findBillSummaryNative();


//    //Thống k số hóa đơn,doanh thu ,sản phẩm trong ngày
//    @Query(value = "SELECT "
//            + "COUNT(DISTINCT b.id) AS BillCount, "
//            + "SUM(bd.quantity) AS TotalShirtQuantity, "
//            + "SUM(DISTINCT b.total_money) AS TotalRevenue "
//            + "FROM bill b "
//            + "JOIN bill_detail bd ON bd.bill_id = b.id "
//            + "WHERE DATE(b.created_at) = CURRENT_DATE",
//            nativeQuery = true)
//    List<Object[]> findBillStatisticsNative();

//Thống kê theo tháng trong năm
//thống kê sản phẩm

    @Query(value = "SELECT MONTH(b.create_at) AS month, SUM(bd.quantity) AS totalQuantity " +
            "FROM bill_detail bd " +
            "JOIN bill b ON bd.bill_id = b.id " +
            "GROUP BY MONTH(b.create_at) " +
            "ORDER BY MONTH(b.create_at)", nativeQuery = true)
    List<Object[]> getTotalQuantityByMonth();

    // thống kê doanh thu
    @Query(value = "SELECT MONTH(b.create_at) AS month, SUM(bd.price * bd.quantity) AS totalRevenue " +
            "FROM bill_detail bd " +
            "JOIN bill b ON bd.bill_id = b.id " +
            "GROUP BY MONTH(b.create_at) " +
            "ORDER BY MONTH(b.create_at)", nativeQuery = true)
    List<Object[]> getTotalRevenueByMonth();
    //thống kê số hóa đơn
    @Query(value = "SELECT MONTH(b.create_at) AS month, COUNT(DISTINCT b.id) AS totalOrders " +
            "FROM bill b " +
            "JOIN bill_detail bd ON bd.bill_id = b.id " +
            "GROUP BY MONTH(b.create_at) " +
            "ORDER BY MONTH(b.create_at)", nativeQuery = true)
    List<Object[]> getTotalOrdersByMonth();

    //
//
//
// Truy vấn thống kê tổng hợp các hóa đơn (native query)
// Thống kê số hóa đơn, sản phẩm và doanh thu trong ngày
    @Query(value = "SELECT "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE CAST(b.create_at AS DATE) = CAST(GETDATE() AS DATE)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForToday();

    // Thống kê theo tháng hiện tại
    @Query(value = "SELECT "
            + "MONTH(b.create_at) AS month, "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE YEAR(b.create_at) = YEAR(GETDATE()) "
            + "AND MONTH(b.create_at) = MONTH(GETDATE()) "
            + "GROUP BY MONTH(b.create_at) "
            + "ORDER BY MONTH(b.create_at)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForCurrentMonth();

    // Thống kê cho tuần hiện tại
    @Query(value = "SELECT "
            + "DATEPART(WEEK, b.create_at) AS week, "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE YEAR(b.create_at) = YEAR(GETDATE()) "
            + "AND DATEPART(WEEK, b.create_at) = DATEPART(WEEK, GETDATE()) "
            + "GROUP BY DATEPART(WEEK, b.create_at) "
            + "ORDER BY DATEPART(WEEK, b.create_at)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForCurrentWeek();

    // Thống kê cho tháng trước
    @Query(value = "SELECT "
            + "MONTH(b.create_at) AS month, "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE YEAR(b.create_at) = YEAR(GETDATE()) "
            + "AND MONTH(b.create_at) = MONTH(GETDATE()) - 1 "
            + "GROUP BY MONTH(b.create_at) "
            + "ORDER BY MONTH(b.create_at)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForLastMonth();

}

