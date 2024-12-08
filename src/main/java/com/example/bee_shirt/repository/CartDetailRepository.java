package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CartDetailRepository extends JpaRepository<CartDetail,Integer> {
    @Query("SELECT cd FROM CartDetail cd WHERE cd.cart.account.code LIKE :query AND cd.statusCartDetail = :status")
    List<CartDetail> findCartDetailByAccountCodeAndStatusCartDetail(String query, Integer status);

}
