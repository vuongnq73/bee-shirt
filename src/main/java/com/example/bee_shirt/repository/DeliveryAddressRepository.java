package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.DeliveryAddress;
import com.example.bee_shirt.entity.ShirtDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Integer> {
    @Query("SELECT da FROM DeliveryAddress da WHERE da.account.code LIKE %:query% AND da.deleted = false")
    List<DeliveryAddress> findDeliveryAddressByAccountCode(@Param("query") String query);
}
