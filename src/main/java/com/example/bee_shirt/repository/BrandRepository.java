package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.dto.ShirtResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    List<Brand>findAll();
    Brand findByCodeBrand(String codeBrand);

}
