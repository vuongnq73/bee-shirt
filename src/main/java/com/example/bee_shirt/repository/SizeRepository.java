package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SizeRepository extends JpaRepository<Size, Integer> {

    @Query("SELECT s.codeSize, s.namesize, s.statussize FROM Size s WHERE s.deleted = false")
    Page<Size> findAllSizes(Pageable pageable);


    Size findByCodeSize(String codeSize);
}
