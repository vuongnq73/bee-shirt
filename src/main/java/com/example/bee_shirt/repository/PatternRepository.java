package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PatternRepository extends JpaRepository<Pattern, Integer> {

    @Query("SELECT p.codePattern, p.namePattern, p.statusPattern FROM Pattern p WHERE p.deleted = false")
    Page<Pattern> findAllPatterns(Pageable pageable);

    Pattern findByCodePattern(String codePattern);
}
