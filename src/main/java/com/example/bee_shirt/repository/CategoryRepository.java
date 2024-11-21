package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT c.codeCategory, c.nameCategory, c.statusCategory FROM Category c WHERE c.deleted = false")
    Page<Category> findAllCategory(Pageable pageable);

    Category findByCodeCategory(String codeCategory);
}
