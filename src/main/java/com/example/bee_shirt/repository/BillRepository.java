package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("SELECT b FROM Bill b WHERE b.codeBill LIKE :query")
    Bill findBillByCode(String query);

    @Query("SELECT b FROM Bill b WHERE b.statusBill = 0")

    List<Bill> findPendingBill();


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
            + "WHERE b.create_at >= CAST(GETDATE() AS DATE) "
            + "AND b.create_at < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForToday();


    @Query(value = "SELECT "
            + "MONTH(b.create_at) AS month, "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE b.create_at >= DATEADD(MONTH, -2, DATEADD(DAY, 1 - DAY(GETDATE()), CAST(GETDATE() AS DATE))) "
            + "AND b.create_at < DATEADD(DAY, 1 - DAY(GETDATE()), CAST(GETDATE() AS DATE)) "
            + "GROUP BY MONTH(b.create_at) "
            + "ORDER BY MONTH(b.create_at)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForLastMonth();



    @Query(value = "SELECT "
            + "MONTH(b.create_at) AS month, "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE b.create_at >= DATEADD(DAY, 1 - DAY(GETDATE()), CAST(GETDATE() AS DATE)) "
            + "AND b.create_at < DATEADD(MONTH, 1, DATEADD(DAY, 1 - DAY(GETDATE()), CAST(GETDATE() AS DATE))) "
            + "GROUP BY MONTH(b.create_at) "
            + "ORDER BY MONTH(b.create_at)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForCurrentMonth();


    @Query(value = "SELECT "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE b.create_at >= DATEADD(DAY, -1, DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)) "
            + "AND b.create_at < DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()) + 1, 0)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForCurrentWeek();


    // Thống kê cho năm hiện tại
    @Query(value = "SELECT "
            + "MONTH(b.create_at) AS month, "
            + "COUNT(DISTINCT b.id) AS totalOrders, "
            + "SUM(bd.quantity) AS totalShirtQuantity, "
            + "SUM(b.total_money) AS totalRevenue "
            + "FROM bill b "
            + "JOIN bill_detail bd ON bd.bill_id = b.id "
            + "WHERE YEAR(b.create_at) = YEAR(GETDATE()) "
            + "GROUP BY MONTH(b.create_at) "
            + "ORDER BY MONTH(b.create_at)",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForCurrentYear();

//thống kê doanh thu tại cửa hàng và online theo ngày
@Query(value = "SELECT " +
        "COALESCE(SUM(CASE WHEN type_bill = 'Online' THEN total_money ELSE 0 END), 0) AS TotalOnlineMoney, " +
        "COALESCE(SUM(CASE WHEN type_bill = 'In-Store' THEN total_money ELSE 0 END), 0) AS TotalInstoreMoney, " +
        "COALESCE(SUM(total_money), 0) AS TotalAllMoney " +
        "FROM bill " +
        "WHERE FORMAT(create_at, 'yyyy-MM-dd') = FORMAT(GETDATE(), 'yyyy-MM-dd') " + // Theo ngày hiện tại
        "AND deleted = 0",
        nativeQuery = true)
List<Object[]> findBillStatisticsForTodayy();

//thống kê doanh thu tại cửa hàng và online theo 7 ngày gần nhất
@Query(value = "SELECT " +
        "SUM(CASE WHEN type_bill = 'Online' THEN total_money ELSE 0 END) AS TotalOnlineMoney, " +
        "SUM(CASE WHEN type_bill = 'In-Store' THEN total_money ELSE 0 END) AS TotalInstoreMoney, " +
        "SUM(total_money) AS TotalAllMoney " +
        "FROM bill " +
        "WHERE create_at >= DATEADD(DAY, -7, CAST(GETDATE() AS DATE)) " +
        "AND create_at <= CAST(GETDATE() AS DATE) " +
        "AND deleted = 0",
        nativeQuery = true)
List<Object[]> findBillStatisticsForLast7Days();

    //thống kê doanh thu tại cửa hàng và online theo 30 ngày
    @Query(value = "SELECT " +
            "SUM(CASE WHEN type_bill = 'Online' THEN total_money ELSE 0 END) AS TotalOnlineMoney, " +
            "SUM(CASE WHEN type_bill = 'In-Store' THEN total_money ELSE 0 END) AS TotalInstoreMoney, " +
            "SUM(total_money) AS TotalAllMoney " +
            "FROM bill " +
            "WHERE create_at >= DATEADD(DAY, -30, GETDATE()) " + // Lấy 30 ngày trước
            "AND deleted = 0",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForLast30Days();


    //thống kê doanh thu tại cửa hàng và online theo năm
    @Query(value = "SELECT " +
            "SUM(CASE WHEN type_bill = 'Online' THEN total_money ELSE 0 END) AS TotalOnlineMoney, " +
            "SUM(CASE WHEN type_bill = 'In-Store' THEN total_money ELSE 0 END) AS TotalInstoreMoney, " +
            "SUM(total_money) AS TotalAllMoney " +
            "FROM bill " +
            "WHERE YEAR(create_at) = YEAR(GETDATE()) " + // Lấy năm hiện tại
            "AND deleted = 0",
            nativeQuery = true)
    List<Object[]> findBillStatisticsForCurrentYearr();

//ống kê tỉ lệ đơn hàngtaijij quầy và online
@Query(value = "SELECT type_bill AS BillType, COUNT(*) AS TotalBills " +
        "FROM bill " +
        "WHERE type_bill IN ('Online', 'In-store') " +
        "GROUP BY type_bill",
        nativeQuery = true)
List<Object[]> findTotalBillsByType();


///
@Transactional
@Modifying
@Query("UPDATE Bill b SET b.statusBill = 2 WHERE b.createAt < CURRENT_DATE AND b.statusBill = 0")
int cancelOldPendingBills();
}

