package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.ShirtDetailDTO;
import com.example.bee_shirt.dto.ShirtResponseDTO;
import com.example.bee_shirt.entity.Shirt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShirtRepository extends JpaRepository<Shirt, Integer> {

    Shirt findByCodeshirt(String codeshirt);

    @Query("SELECT new com.example.bee_shirt.dto.ShirtResponseDTO(" +
            "s.id, " +
            "s.codeshirt, " +
            "s.nameshirt, " +
            "s.createBy, " +
            "s.updateBy, " +
            "COALESCE(s.createAt, '1970-01-01'), " +   // Thay thế null bằng thời gian mặc định
            "COALESCE(s.updateat, '1970-01-01'), " +    // Thay thế null bằng thời gian mặc định
            "s.statusshirt, " +
            "COALESCE(b.nameBrand, ''), " +             // Thay thế null tên thương hiệu bằng chuỗi trống
            "COALESCE(c.nameCategory, ''), " +          // Thay thế null tên danh mục bằng chuỗi trống
            "COALESCE(c.id, 0), " +                     // Thay thế null id danh mục bằng 0
            "COALESCE(b.id, 0), " +                     // Thay thế null id thương hiệu bằng 0
            "s.deleted, " +
            "s.description, " +

            "COALESCE((SELECT SUM(sd.quantity) FROM ShirtDetail sd WHERE sd.shirt.id = s.id), 0) " +  // Thay thế null số lượng bằng 0
            ") " +
            "FROM Shirt s " +
            "JOIN s.brand b " +
            "JOIN s.category c " +
            "ORDER BY s.id DESC")
    Page<ShirtResponseDTO> findAllShirt(Pageable pageable);

    @Query("SELECT new com.example.bee_shirt.dto.ShirtResponseDTO(" +
            "s.id, " +
            "s.codeshirt, " +
            "s.nameshirt, " +
            "s.createBy, " +
            "s.updateBy, " +
            "COALESCE(s.createAt, '1970-01-01'), " +   // Thay thế null bằng thời gian mặc định
            "COALESCE(s.updateat, '1970-01-01'), " +    // Thay thế null bằng thời gian mặc định
            "s.statusshirt, " +
            "COALESCE(b.nameBrand, ''), " +             // Thay thế null tên thương hiệu bằng chuỗi trống
            "COALESCE(c.nameCategory, ''), " +          // Thay thế null tên danh mục bằng chuỗi trống
            "COALESCE(c.id, 0), " +                     // Thay thế null id danh mục bằng 0
            "COALESCE(b.id, 0), " +                     // Thay thế null id thương hiệu bằng 0
            "s.deleted, " +
            "s.description, " +
            "COALESCE((SELECT SUM(sd.quantity) FROM ShirtDetail sd WHERE sd.shirt.id = s.id), 0) " +  // Thay thế null số lượng bằng 0
            ") " +
            "FROM Shirt s " +
            "JOIN s.brand b " +
            "JOIN s.category c " +
            "WHERE s.deleted=false " +
            "ORDER BY s.id DESC")
    ShirtResponseDTO findByCode(String codeshirt);
    //check trùng tên
    boolean existsByNameshirt(String nameshirt);

}
