package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.Cart;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartDetailRepository extends JpaRepository<CartDetail,Integer> {
    @Query("SELECT cd FROM CartDetail cd WHERE cd.cart.account.code LIKE :query AND cd.statusCartDetail = :status")
    List<CartDetail> findCartDetailByAccountCodeAndStatusCartDetail(String query, Integer status);
    Optional<CartDetail> findByCartAndShirtDetail(Cart cart, ShirtDetail shirtDetail);

}
