package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.DeliveryAddressGiang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddressGiang, Integer> {
    @Query(value = """
                SELECT TOP 1 * FROM delivery_address ORDER BY id DESC
            """, nativeQuery = true)
    DeliveryAddressGiang getTop1();

    @Query(value = """
                    select * from delivery_address
                    			where account_id = :accountId
            """, nativeQuery = true)
    DeliveryAddressGiang findByAccountId(Integer accountId);
}
