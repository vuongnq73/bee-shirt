package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BIllStaticsRepo extends JpaRepository<Bill,Integer> {
    //loc san pham ban chay theo cac trường
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
            WHERE\s
    (:brand IS NULL OR b.name_brand = :brand) \s
    AND (:shirtName IS NULL OR s.name_shirt = :shirtName) \s
    AND (:size IS NULL OR sz.name_size = :size)
    AND (:month IS NULL OR MONTH(bl.create_date) = :month) \s
    AND (:year IS NULL OR YEAR(bl.create_date) = :year)
  -- Chỉ lọc theo năm nếu có giá trị-- Chỉ lọc theo size nếu có giá trị
GROUP BY 
    b.name_brand, s.name_shirt, sz.name_size
ORDER BY 
    TotalQuantitySold DESC
""", nativeQuery = true)
    List<Object[]> findBillStaticsNative(
            @Param("brand") String brand,
            @Param("shirtName") String shirtName,
            @Param("size") String size,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

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
