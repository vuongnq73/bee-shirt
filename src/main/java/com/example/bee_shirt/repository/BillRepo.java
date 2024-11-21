package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepo extends JpaRepository<Bill,Integer> {
}
