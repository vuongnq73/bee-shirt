package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
}
