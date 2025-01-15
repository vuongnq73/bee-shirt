package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Origin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OriginRepository extends JpaRepository<Origin, Integer> {

    @Query("SELECT o.codeOrigin, o.nameOrigin, o.statusOrigin FROM Origin o WHERE o.deleted = false")
    Page<Origin> findAllOrigins(Pageable pageable);


    Origin findByCodeOrigin(String codeOrigin);
}
