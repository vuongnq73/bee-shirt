package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.ShirtDetailDTO;
import com.example.bee_shirt.dto.response.HomePageResponse;
import com.example.bee_shirt.entity.ShirtDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ShirtDetailRepository extends JpaRepository<ShirtDetail, Integer> {
    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.codeShirtDetail LIKE %:query%")
    ShirtDetail findShirtDetailByCode(@Param("query") String query);
    //

    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.codeShirtDetail LIKE %:query% OR sd.shirt.nameshirt LIKE %:query%")
    Page<ShirtDetail> findListShirtDetailByCodeOrName(@Param("query") String query, Pageable pageable);

    // Truy vấn tất cả chi tiết áo không bị xóa và có trạng thái 1
    @Query("SELECT new com.example.bee_shirt.dto.ShirtDetailDTO(" +
            "sdt.id, sdt.codeShirtDetail,ss.codeshirt, CONCAT(ss.nameshirt, '[ ', c.nameColor, '+ ', si.namesize,']'), sdt.price, sdt.quantity, p.namePattern, " +
            "g.nameGender, o.nameOrigin, s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, sdt.statusshirtdetail, " +
            "sdt.createBy, sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted,ss.id, p.id, g.id, o.id, s.id, si.id, m.id, c.id) " +
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
            "sdt.id, sdt.codeShirtDetail,ss.codeshirt, CONCAT(ss.nameshirt, ' ', c.nameColor, ' ', si.namesize), sdt.price, sdt.quantity, p.namePattern, g.nameGender, o.nameOrigin, " +
            "s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, sdt.statusshirtdetail, sdt.createBy, " +
            "sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted,ss.id,p.id,g.id,o.id,s.id,si.id,m.id,c.id) " +
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
            "sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted, ss.id, p.id, g.id, o.id, s.id, si.id, m.id, c.id) " +
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
                                    SELECT Top 5
                                      sd.image AS image,
                                      s.name_shirt AS nameShirt,
                                      b.name_brand AS nameBrand,
                                      sz.name_size AS nameSize,
                          			cl.name_color AS nameColor,
                          			sd.price,
                          			SUM(ISNULL(bd.quantity, 0)) AS TotalQuantitySold
                                      FROM shirt_detail sd
                                      LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                          			LEFT JOIN bill_detail bd ON bd.shirt_detail_id = sd.id
                          			LEFT JOIN bill bl ON bd.bill_id = bl.id AND bl.create_at BETWEEN DATEADD(MONTH, -1, GETDATE()) AND GETDATE()
                                      LEFT JOIN brand b ON s.brand_id = b.id
                                      LEFT JOIN size sz ON sd.size_id = sz.id
                          			LEFT JOIN color cl ON sd.color_id = cl.id
                          			WHERE sd.status_shirt_detail = 1
                          			GROUP BY
                          			sd.image,
                                      s.name_shirt,
                                      b.name_brand ,
                                      sz.name_size,
                          			cl.name_color,
                          			sd.price
                          			ORDER BY
                          				TotalQuantitySold DESC
    """, nativeQuery = true)
    List<Object[]> getTop5ShirtDetail();

    @Query(value = """
                                    SELECT 
                                      sd.image AS image,
                                      s.name_shirt AS nameShirt,
                                      b.name_brand AS nameBrand,
                                      sz.name_size AS nameSize,
                          			cl.name_color AS nameColor,
                          			sd.price
                                      FROM shirt_detail sd
                                      LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                                      LEFT JOIN brand b ON s.brand_id = b.id
                                      LEFT JOIN size sz ON sd.size_id = sz.id
                          			LEFT JOIN color cl ON sd.color_id = cl.id
                          			WHERE sd.status_shirt_detail = 1    """, nativeQuery = true)
    List<Object[]> getAllShirt();

    @Query(value = """
                SELECT 
                sd.image AS image,
                s.name_shirt AS nameShirt,
                b.name_brand AS nameBrand,
                sz.name_size AS nameSize,
                cl.name_color AS nameColor,
                sd.price
                FROM shirt_detail sd
                LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1 AND c.code_category like :code                                                                                                                                                                         
""", nativeQuery = true)
    List<Object[]> getAllShirtByCategoryCode(@Param("code") String code);

    @Query(value = """
                SELECT 
                sd.image AS image,
                s.name_shirt AS nameShirt,
                b.name_brand AS nameBrand,
                sz.name_size AS nameSize,
                cl.name_color AS nameColor,
                sd.price
                FROM shirt_detail sd
                LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1 AND cl.code_color like :code                                                                                                                                                                         
""", nativeQuery = true)
    List<Object[]> getAllShirtByColor(@Param("code") String code);

    @Query(value = """
                SELECT 
                COUNT(*)
                FROM shirt_detail sd
                LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1                                                                                                                                                                         
""", nativeQuery = true)
    Integer countAll();

    @Query(value = """
                SELECT 
                COUNT(*)
                FROM shirt_detail sd
                LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1 AND c.code_category like :code                                                                                                                                                                         
""", nativeQuery = true)
    Integer countAllByCategoryCode(@Param("code") String code);


    @Query(value = """
                SELECT 
                sd.image AS image,
                s.name_shirt AS nameShirt,
                b.name_brand AS nameBrand,
                sz.name_size AS nameSize,
                cl.name_color AS nameColor,
                sd.price
                FROM shirt_detail sd
                LEFT JOIN shirt s ON sd.shirt_id = s.id AND s.status_shirt = 1
                LEFT JOIN category c ON s.category_id = c.id AND c.status_category = 1
                LEFT JOIN brand b ON s.brand_id = b.id
                LEFT JOIN size sz ON sd.size_id = sz.id
                LEFT JOIN color cl ON sd.color_id = cl.id
                WHERE sd.status_shirt_detail = 1 AND (
            (:min IS NULL AND :max IS NULL OR sd.price BETWEEN :min AND :max)
            AND (:codeColor IS NULL OR cl.code_color LIKE :codeColor)
            AND (:codeBrand IS NULL OR b.code_brand LIKE :codeBrand)
            AND (:codeSize IS NULL OR sz.code_size LIKE :codeSize)
            AND (:category IS NULL OR s.category_id LIKE :category)
            )""", nativeQuery = true)
    List<Object[]> getAllShirtByFiller(@Param("min") BigDecimal min,
                                      @Param("max") BigDecimal max,
                                      @Param("codeColor") String color,
                                      @Param("codeBrand") String brand,
                                      @Param("codeSize") String size,
                                      @Param("category") Integer category );

}
