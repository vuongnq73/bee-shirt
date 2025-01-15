package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // Truy vấn danh mục không bị xóa
    List<Category> findAll();


    Category findByCodeCategory(String codeCategory);

    Category findCategoryByNameCategory(String Name);
}
