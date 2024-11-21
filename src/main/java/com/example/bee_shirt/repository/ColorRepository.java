package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.EntityThuocTinh.Color;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ColorRepository extends JpaRepository<Color, Integer> {
    @Query("SELECT c.codeColor, c.nameColor,c.statusColor FROM Color c WHERE c.deleted=false")
    Page<Color> findAllByColor(Pageable pageable);
    Color findByCodeColor(String codeBrand);
}
