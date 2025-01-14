package com.example.bee_shirt.repository;

import com.example.bee_shirt.EntityThuocTinh.Gender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GenderRepository extends JpaRepository<Gender, Integer> {

    List<Gender> findAll();

    Gender findByCodeGender(String codeGender);

}
