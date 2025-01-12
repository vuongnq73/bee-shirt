package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.Cart;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartDetailRepository extends JpaRepository<CartDetail,Integer> {
    @Query("SELECT cd FROM CartDetail cd WHERE cd.cart.account.code LIKE :query AND cd.statusCartDetail = :status AND cd.deleted = false")
    List<CartDetail> findCartDetailByAccountCodeAndStatusCartDetail(String query, Integer status);
    Optional<CartDetail> findByCartAndShirtDetailAndStatusCartDetail(Cart cart, ShirtDetail shirtDetail, int statusCartDetail);


    @Transactional
    @Modifying
    @Query("UPDATE CartDetail cd SET cd.quantity = cd.shirtDetail.quantity WHERE cd.cart.account.code LIKE :query AND cd.statusCartDetail = 0 AND cd.deleted = false AND cd.quantity > cd.shirtDetail.quantity")
    int updateInvalidQuantity(@Param("query") String query);



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
