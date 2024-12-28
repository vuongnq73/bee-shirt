package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface BIllStaticsRepo extends JpaRepository<Bill,Integer> {
    @Query(value = """
        SELECT 
            s.id AS productId,
            s.name_shirt AS productName,
            SUM(bd.quantity) AS totalQuantitySold,
            SUM(bd.quantity * bd.price) AS totalRevenue
        FROM 
            shirt s
        JOIN 
            bill_detail bd ON s.id = bd.shirt_detail_id
        JOIN 
            bill o ON bd.bill_id = o.id
        WHERE 
            o.create_at >= :startDate
        GROUP BY 
            s.id, s.name_shirt
        ORDER BY 
            totalQuantitySold DESC
        """, nativeQuery = true)
    List<Object[]> findTopSellingProducts(@Param("startDate") Date startDate);
    //Find all sảnphamarm bán chạy

    @Query(value = """
    SELECT 
        b.name_brand AS Brand,
        s.name_shirt AS ShirtName,
        sz.name_size AS Size,
        SUM(bd.quantity) AS TotalQuantitySold
    FROM 
        bill_detail bd
    JOIN 
        bill bl ON bd.bill_id = bl.id
    JOIN 
        shirt_detail sd ON bd.shirt_detail_id = sd.id
    JOIN 
        shirt s ON sd.shirt_id = s.id
    JOIN 
        brand b ON s.brand_id = b.id
    JOIN 
        size sz ON sd.size_id = sz.id
    GROUP BY 
        b.name_brand, s.name_shirt, sz.name_size
    ORDER BY 
        TotalQuantitySold DESC
    """, nativeQuery = true)
    List<Object[]> findAllSticsBestSaler();
//hiển thị thống kê

}
