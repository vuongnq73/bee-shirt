package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepo extends JpaRepository<PaymentMethod,Integer> {
}
