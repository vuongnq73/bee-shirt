package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.BillPayment;
import com.example.bee_shirt.entity.BillPaymentId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillPaymentRepo extends JpaRepository<BillPayment,Integer> {
}

