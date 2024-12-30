package com.example.bee_shirt.repository;


import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    @Query(value = """
            SELECT TOP 1 * FROM cart ORDER BY id DESC
            """, nativeQuery = true)
    Cart getTop1();

}
