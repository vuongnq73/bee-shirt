package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartDetailRepository extends JpaRepository<CartDetail,Integer> {
    @Query("SELECT cd FROM CartDetail cd WHERE cd.cart.account.code LIKE :query AND cd.statusCartDetail = :status AND cd.deleted = false")
    List<CartDetail> findCartDetailByAccountCodeAndStatusCartDetail(String query, Integer status);

    @Query("SELECT cd FROM CartDetail cd WHERE cd.codeCartDetail LIKE %:query%")
    CartDetail findCartDetailByCode(@Param("query") String query);

    @Transactional
    @Modifying
    @Query("UPDATE CartDetail cd SET cd.statusCartDetail = 2 WHERE cd.codeCartDetail LIKE %:query%")
    int checkoutCartDetail(@Param("query") String query);

    @Transactional
    @Modifying
    @Query("UPDATE CartDetail cd SET cd.deleted = true WHERE cd.codeCartDetail LIKE %:query%")
    int cancelCartDetail(@Param("query") String query);

    @Transactional
    @Modifying
    @Query("UPDATE CartDetail cd SET cd.quantity = :quantity WHERE cd.codeCartDetail LIKE %:query%")
    int changeQuantityCartDetail(@Param("query") String query, @Param("quantity") int quantity);
}
