package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.OnlineColorDTO;
import com.example.bee_shirt.dto.OnlineShirtDTO;
import com.example.bee_shirt.dto.ShirtDetailDTO;
import com.example.bee_shirt.dto.response.HomePageResponse;
import com.example.bee_shirt.entity.Shirt;
import com.example.bee_shirt.entity.ShirtDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ShirtDetailRepository extends JpaRepository<ShirtDetail, Integer> {

    @Query("SELECT new com.example.bee_shirt.dto.ShirtDetailDTO(" +
            "sdt.id, sdt.codeShirtDetail,ss.codeshirt, CONCAT(ss.nameshirt, '[ ', c.nameColor, '+ ', si.namesize,']'), sdt.price, sdt.quantity, p.namePattern, " +
            "g.nameGender, o.nameOrigin, s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, sdt.statusshirtdetail, " +
            "sdt.createBy, sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted,ss.id, p.id, g.id, o.id, s.id, si.id, m.id, c.id,sdt.image,sdt.image2,sdt.image3) " +
            "FROM ShirtDetail sdt " +
            "JOIN sdt.shirt ss " +
            "JOIN sdt.pattern p " +
            "JOIN sdt.gender g " +
            "JOIN sdt.origin o " +
            "JOIN sdt.season s " +
            "JOIN sdt.size si " +
            "JOIN sdt.material m " +
            "JOIN sdt.color c " +

            "ORDER BY sdt.id DESC")
    List<ShirtDetailDTO> findAllShirtDetails();


    // Tìm chi tiết áo theo mã chi tiết
    ShirtDetail findByCodeShirtDetail(String codeShirtDetail);

    // Truy vấn chi tiết áo theo mã không bị xóa và có trạng thái 0
    @Query("SELECT new com.example.bee_shirt.dto.ShirtDetailDTO(" +
            "sdt.id, sdt.codeShirtDetail,ss.codeshirt, CONCAT(ss.nameshirt, ' [', c.nameColor, ' +', si.namesize,']'), sdt.price, sdt.quantity, p.namePattern, g.nameGender, o.nameOrigin, " +
            "s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, sdt.statusshirtdetail, sdt.createBy, " +
            "sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted,ss.id,p.id,g.id,o.id,s.id,si.id,m.id,c.id,sdt.image,sdt.image2,sdt.image3) " +
            "FROM ShirtDetail sdt " +
            "JOIN sdt.shirt ss " +
            "JOIN sdt.pattern p " +
            "JOIN sdt.gender g " +
            "JOIN sdt.origin o " +
            "JOIN sdt.season s " +
            "JOIN sdt.size si " +
            "JOIN sdt.material m " +
            "JOIN sdt.color c " +
            "WHERE sdt.codeShirtDetail = ?1" +
            "ORDER BY sdt.id DESC")
    Page<ShirtDetailDTO> findAllShirtDetailByName(Pageable pageable);
    // Truy vấn chi tiết áo theo mã áo
    @Query("SELECT new com.example.bee_shirt.dto.ShirtDetailDTO(" +
            "sdt.id, sdt.codeShirtDetail,ss.codeshirt, CONCAT(ss.nameshirt, ' ', c.nameColor, ' ', si.namesize), sdt.price, sdt.quantity, p.namePattern, g.nameGender, o.nameOrigin, " +
            "s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, sdt.statusshirtdetail, sdt.createBy, " +
            "sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted, ss.id, p.id, g.id, o.id, s.id, si.id, m.id, c.id,sdt.image,sdt.image2,sdt.image3) " +
            "FROM ShirtDetail sdt " +
            "JOIN sdt.shirt ss " +
            "JOIN sdt.pattern p " +
            "JOIN sdt.gender g " +
            "JOIN sdt.origin o " +
            "JOIN sdt.season s " +
            "JOIN sdt.size si " +
            "JOIN sdt.material m " +
            "JOIN sdt.color c " +
            "WHERE ss.codeshirt = :codeshirt " +
            "ORDER BY sdt.id DESC")
    List<ShirtDetailDTO> findAllShirtDetailByCodeShirt(@Param("codeshirt") String codeshirt);


    @Query(value = """
            SELECT TOP 5
              s.code_shirt AS codeShirt,
              sd.image AS image,
              s.name_shirt AS nameShirt,
              b.name_brand AS nameBrand,
              sz.name_size AS nameSize,
              cl.name_color AS nameColor,
              MIN(sd.price) AS price,
              SUM(ISNULL(bd.quantity, 0)) AS TotalQuantitySold
            FROM shirt_detail sd
            RIGHT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
            LEFT JOIN bill_detail bd ON bd.shirt_detail_id = sd.id
            LEFT JOIN bill bl ON bd.bill_id = bl.id
            AND bl.create_at BETWEEN DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0)
                                    AND DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)
            LEFT JOIN brand b ON s.brand_id = b.id
            LEFT JOIN size sz ON sd.size_id = sz.id
            LEFT JOIN color cl ON sd.color_id = cl.id
            WHERE sd.status_shirt_detail = 1
            GROUP BY
            s.code_shirt,
              sd.image,
              s.name_shirt,
              b.name_brand,
              sz.name_size,
              cl.name_color
            ORDER BY TotalQuantitySold DESC;
    """, nativeQuery = true)
    List<Object[]> getTop5ShirtDetail();

    @Query(value = """
                                    SELECT 
                                    s.code_shirt AS codeShirt,
                                      sd.image AS image,
                                      s.name_shirt AS nameShirt,
                                      b.name_brand AS nameBrand,
                                      sz.name_size AS nameSize,
                          			cl.name_color AS nameColor,
                          			MIN(sd.price) AS price
                                      FROM shirt_detail sd
                                      RIGHT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                                      LEFT JOIN brand b ON s.brand_id = b.id
                                      LEFT JOIN size sz ON sd.size_id = sz.id
                          			LEFT JOIN color cl ON sd.color_id = cl.id
                          			WHERE sd.status_shirt_detail = 1
                          			GROUP BY
                          			s.code_shirt,
                                      sd.image,
                                      s.name_shirt,
                                      b.name_brand,
                                      sz.name_size,
                                      cl.name_color
                                      """, nativeQuery = true)
    List<Object[]> getAllShirt();

    @Query(value = """
                SELECT 
                s.code_shirt AS codeShirt,
                sd.image AS image,
                s.name_shirt AS nameShirt,
                b.name_brand AS nameBrand,
                sz.name_size AS nameSize,
                cl.name_color AS nameColor,
                MIN(sd.price) AS price
                FROM shirt_detail sd
                RIGHT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1 AND c.code_category like :code 
                GROUP BY
                s.code_shirt,
                                      sd.image,
                                      s.name_shirt,
                                      b.name_brand,
                                      sz.name_size,
                                      cl.name_color                                                                                                                                                                        
""", nativeQuery = true)
    List<Object[]> getAllShirtByCategoryCode(@Param("code") String code);

    @Query(value = """
                SELECT 
                s.code_shirt AS codeShirt,
                sd.image AS image,
                s.name_shirt AS nameShirt,
                b.name_brand AS nameBrand,
                sz.name_size AS nameSize,
                cl.name_color AS nameColor,
                MIN(sd.price) AS price
                FROM shirt_detail sd
                RIGHT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1 AND cl.code_color like :code
                GROUP BY
                s.code_shirt,
                                      sd.image,
                                      s.name_shirt,
                                      b.name_brand,
                                      sz.name_size,
                                      cl.name_color                                                                                                                                                                         
""", nativeQuery = true)
    List<Object[]> getAllShirtByColor(@Param("code") String code);

    @Query(value = """
               SELECT COUNT(distinct s.name_shirt)
            FROM shirt_detail sd
            RIGHT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
            LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
            LEFT JOIN brand b ON s.brand_id = b.id
            LEFT JOIN size sz ON sd.size_id = sz.id
            LEFT JOIN color cl ON sd.color_id = cl.id
            WHERE sd.status_shirt_detail = 1
                AND (:min IS NULL OR :max IS NULL OR (sd.price BETWEEN :min AND :max))
                AND (:codeColor IS NULL OR cl.code_color LIKE :codeColor)
                AND (:codeBrand IS NULL OR b.code_brand LIKE :codeBrand)
                AND (:codeSize IS NULL OR sz.code_size LIKE :codeSize)
                AND (:category IS NULL OR s.category_id LIKE :category)                                                                                                                                                                 
""", nativeQuery = true)
    Integer countAll(@Param("min") BigDecimal min,
                     @Param("max") BigDecimal max,
                     @Param("codeColor") String color,
                     @Param("codeBrand") String brand,
                     @Param("codeSize") String size,
                     @Param("category") Integer category);


    @Query(value = """
WITH RankedShirts AS (
    SELECT
        s.code_shirt AS codeShirt,
        sd.image AS image,
        s.name_shirt AS nameShirt,
        b.name_brand AS nameBrand,
        sz.name_size AS nameSize,
        cl.name_color AS nameColor,
        sd.price,
        ROW_NUMBER() OVER (PARTITION BY s.code_shirt ORDER BY sd.price ASC, sd.id ASC) AS rn
    FROM shirt_detail sd
    LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
    LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
    LEFT JOIN brand b ON s.brand_id = b.id
    LEFT JOIN size sz ON sd.size_id = sz.id
    LEFT JOIN color cl ON sd.color_id = cl.id
    WHERE sd.status_shirt_detail = 1 AND (
            (:min IS NULL OR :max IS NULL OR (sd.price BETWEEN :min AND :max))
            AND (:codeColor IS NULL OR cl.code_color LIKE :codeColor)
            AND (:codeBrand IS NULL OR b.code_brand LIKE :codeBrand)
            AND (:codeSize IS NULL OR sz.code_size LIKE :codeSize)
            AND (:category IS NULL OR s.category_id LIKE :category)
            )
)
SELECT
    codeShirt,
    image,
    nameShirt,
    nameBrand,
    nameSize,
    nameColor,
    price
FROM RankedShirts
WHERE rn = 1
ORDER BY
    codeShirt,
    image,
    nameShirt,
    nameBrand,
    nameSize,
    nameColor
OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
            """, nativeQuery = true)
    List<Object[]> getAllShirtByFiller(@Param("min") BigDecimal min,
                                       @Param("max") BigDecimal max,
                                       @Param("codeColor") String color,
                                       @Param("codeBrand") String brand,
                                       @Param("codeSize") String size,
                                       @Param("category") Integer category,
                                       @Param("limit") int limit,
                                       @Param("offset") int offset);

    @Query(value = """
WITH RankedShirts AS (
    SELECT
        s.code_shirt AS codeShirt,
        sd.image AS image,
        s.name_shirt AS nameShirt,
        b.name_brand AS nameBrand,
        sz.name_size AS nameSize,
        cl.name_color AS nameColor,
        sd.price,
        ROW_NUMBER() OVER (PARTITION BY s.code_shirt ORDER BY sd.price ASC, sd.id ASC) AS rn
    FROM shirt_detail sd
    LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
    LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
    LEFT JOIN brand b ON s.brand_id = b.id
    LEFT JOIN size sz ON sd.size_id = sz.id
    LEFT JOIN color cl ON sd.color_id = cl.id
    WHERE sd.status_shirt_detail = 1 AND (
            (:min IS NULL OR :max IS NULL OR (sd.price BETWEEN :min AND :max))
            AND (:codeColor IS NULL OR cl.code_color LIKE :codeColor)
            AND (:codeBrand IS NULL OR b.code_brand LIKE :codeBrand)
            AND (:codeSize IS NULL OR sz.code_size LIKE :codeSize)
            AND (:category IS NULL OR s.category_id LIKE :category)
            )
)
SELECT
    codeShirt,
    image,
    nameShirt,
    nameBrand,
    nameSize,
    nameColor,
    price
FROM RankedShirts
WHERE rn = 1
ORDER BY
    codeShirt,
    image,
    nameShirt,
    nameBrand,
    nameSize,
    nameColor
            """, nativeQuery = true)
    List<Object[]> getAllByFiller(@Param("min") BigDecimal min,
                                  @Param("max") BigDecimal max,
                                  @Param("codeColor") String color,
                                  @Param("codeBrand") String brand,
                                  @Param("codeSize") String size,
                                  @Param("category") Integer category);


    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.codeShirtDetail LIKE %:query%")
    ShirtDetail findShirtDetailByCode(@Param("query") String query);

    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.codeShirtDetail LIKE %:query% AND sd.quantity>0 and sd.statusshirtdetail = 1 and sd.deleted = false and sd.shirt.statusshirt = 1 and sd.shirt.deleted = false")
    ShirtDetail getShirtDetail4Scan(@Param("query") String query);
    //

    @Query("SELECT sd FROM ShirtDetail sd WHERE (sd.codeShirtDetail LIKE %:query% OR sd.shirt.nameshirt LIKE %:query% OR sd.color.nameColor LIKE %:query% OR sd.size.namesize LIKE %:query% OR sd.pattern.namePattern LIKE %:query% )AND sd.deleted = false AND sd.quantity > 0 and sd.shirt.deleted = false and sd.statusshirtdetail = 1 and sd.shirt.statusshirt = 1")
    Page<ShirtDetail> findListShirtDetailByCodeOrName(@Param("query") String query, Pageable pageable);

    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.deleted = false AND sd.quantity > 0 and sd.shirt.deleted = false and sd.statusshirtdetail = 1 and sd.shirt.statusshirt = 1")
    List<ShirtDetail> findAllAvaiable();


    @Query("SELECT DISTINCT new com.example.bee_shirt.dto.OnlineShirtDTO(b.codeBrand,b.nameBrand,ca.codeCategory, ca.nameCategory,s.codeshirt, s.nameshirt,s.description) " +
            "FROM ShirtDetail sd " +
            "JOIN sd.shirt s " +
            "JOIN s.brand b " +
            "JOIN s.category ca ")
    List<OnlineShirtDTO> findDistinctShirts();
    @Query("SELECT DISTINCT new com.example.bee_shirt.dto.OnlineColorDTO(" +
            " s.codeshirt, c.codeColor, c.nameColor, si.codeSize, si.namesize, sd.image, sd.image2, sd.image3, m.nameMaterial, sd.quantity, sd.price,sd.id) " +
            "FROM ShirtDetail sd " +
            "JOIN sd.shirt s " +
            "JOIN sd.color c " +
            "JOIN sd.material m " +
            "JOIN sd.size si " +
            "WHERE s.codeshirt = :codeshirt")
    List<OnlineColorDTO> findColorsByShirtCode(@Param("codeshirt") String codeshirt);

//
@Modifying
@Query(value = "UPDATE shirt_detail " +
        "SET shirt_detail.quantity = shirt_detail.quantity - bd.quantity " +
        "FROM shirt_detail " +
        "JOIN bill_detail bd ON shirt_detail.id = bd.shirt_detail_id " +
        "JOIN bill b ON b.id = bd.bill_id " +
        "WHERE b.code_bill = :codeBill",
        nativeQuery = true)
void updateQuantityByCodeBill(@Param("codeBill") String codeBill);
//kiểm tra số lượng sản phâm trong kho
    @Modifying
    @Query(value = "SELECT sd.code_shirt_detail, sd.quantity " +
            "FROM shirt_detail sd " +
            "JOIN bill_detail bd ON sd.id = bd.shirt_detail_id " +
            "JOIN bill b ON bd.bill_id = b.id " +
            "WHERE b.code_bill = :codeBill",
            nativeQuery = true)
    List<Object[]> findShirtDetailsByBillCode(@Param("codeBill") String codeBill);

}
