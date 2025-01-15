package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GenderRepository extends JpaRepository<Gender, Integer> {

    @Query("SELECT g.codeGender, g.nameGender, g.statusGender FROM Gender g WHERE g.deleted = false")
    Page<Gender> findAllGender(Pageable pageable);


    Gender findByCodeGender(String codeGender);

}
