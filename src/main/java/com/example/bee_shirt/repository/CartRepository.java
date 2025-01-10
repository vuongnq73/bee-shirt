package com.example.bee_shirt.repository;


import com.example.bee_shirt.entity.Account;
import com.example.bee_shirt.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    @Query(value = """
            SELECT TOP 1 * FROM cart ORDER BY id DESC
            """, nativeQuery = true)
    Cart getTop1();
    @Query("SELECT c.id FROM Cart c WHERE c.account.id = :accountId")
    List<Integer> findCartIdsByAccountId(@Param("accountId") Integer accountId);
    Optional<Cart> findById(Integer id);

}
