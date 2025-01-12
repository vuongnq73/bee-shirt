package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.PaymentMethod;
import com.example.bee_shirt.entity.ShirtDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentMethodRepo extends JpaRepository<PaymentMethod,Integer> {
    @Query("SELECT pm FROM PaymentMethod pm WHERE pm.codePaymentMethod LIKE %:query%")
    PaymentMethod findPaymentMethodByCode(@Param("query") String query);
}
