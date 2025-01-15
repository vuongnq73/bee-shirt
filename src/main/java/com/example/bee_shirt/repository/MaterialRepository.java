package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MaterialRepository extends JpaRepository<Material, Integer> {

    @Query("SELECT m.codeMaterial, m.nameMaterial, m.statusMaterial FROM Material m WHERE m.deleted = false")
    Page<Material> findAllMaterials(Pageable pageable);


    Material findByCodeMaterial(String codeMaterial);
}
