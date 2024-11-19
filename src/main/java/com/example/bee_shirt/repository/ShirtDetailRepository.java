package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.ShirtDetailDTO;
import com.example.bee_shirt.entity.ShirtDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShirtDetailRepository extends JpaRepository<ShirtDetail, Integer> {

    // Truy vấn tất cả chi tiết áo không bị xóa và có trạng thái 1
    @Query("SELECT new com.example.bee_shirt.dto.ShirtDetailDTO(" +
            "sdt.id, sdt.codeShirtDetail, CONCAT(ss.nameshirt, ' ', c.nameColor, ' ', si.namesize), sdt.price, sdt.quantity, " +
            "p.namePattern, g.nameGender, o.nameOrigin, s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, " +
            "sdt.statusshirtdetail, sdt.createBy, sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted, ss.id, " +
            "p.id, g.id, o.id, s.id, si.id, m.id, c.id) " +
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
    Page<ShirtDetailDTO> findAllShirtDetails(Pageable pageable);

    // Tìm chi tiết áo theo mã chi tiết
    ShirtDetail findByCodeShirtDetail(String codeShirtDetail);

    // Truy vấn chi tiết áo theo mã không bị xóa và có trạng thái 0
    @Query("SELECT new com.example.bee_shirt.dto.ShirtDetailDTO(" +
            "sdt.id, sdt.codeShirtDetail, CONCAT(ss.nameshirt, ' ', c.nameColor, ' ', si.namesize), sdt.price, sdt.quantity, " +
            "p.namePattern, g.nameGender, o.nameOrigin, s.nameSeason, si.namesize, m.nameMaterial, c.nameColor, " +
            "sdt.statusshirtdetail, sdt.createBy, sdt.createAt, sdt.updateBy, sdt.updateAt, sdt.deleted, ss.id, " +
            "p.id, g.id, o.id, s.id, si.id, m.id, c.id) " +
            "FROM ShirtDetail sdt " +
            "JOIN sdt.shirt ss " +
            "JOIN sdt.pattern p " +
            "JOIN sdt.gender g " +
            "JOIN sdt.origin o " +
            "JOIN sdt.season s " +
            "JOIN sdt.size si " +
            "JOIN sdt.material m " +
            "JOIN sdt.color c " +
            "WHERE sdt.codeShirtDetail = ?1 AND sdt.deleted = false AND sdt.statusshirtdetail = 0 " +
            "ORDER BY sdt.id DESC")
    ShirtDetailDTO findByCodeShirtDetailDTO(String codeShirtDetail);

    // Tìm danh sách chi tiết áo theo mã hoặc tên với hỗ trợ phân trang
    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.codeShirtDetail LIKE %:query% OR sd.shirt.nameshirt LIKE %:query%")
    Page<ShirtDetail> findListShirtDetailByCodeOrName(@Param("query") String query, Pageable pageable);

    // Tìm chi tiết áo theo mã với tìm kiếm mờ
    @Query("SELECT sd FROM ShirtDetail sd WHERE sd.codeShirtDetail LIKE %:query%")
    ShirtDetail findShirtDetailByCode(@Param("query") String query);
}
