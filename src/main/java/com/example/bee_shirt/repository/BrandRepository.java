package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.dto.ShirtResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    @Query("SELECT b.codeBrand, b.nameBrand,b.statusBrand FROM Brand b WHERE b.deleted=false")
    Page<Brand> findAllBrand(Pageable pageable);
    Brand findByCodeBrand(String codeBrand);

}
