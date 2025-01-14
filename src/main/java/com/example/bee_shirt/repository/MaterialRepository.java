package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, Integer> {

    @Override
    List<Material> findAll();

    Material findByCodeMaterial(String codeMaterial);
}
