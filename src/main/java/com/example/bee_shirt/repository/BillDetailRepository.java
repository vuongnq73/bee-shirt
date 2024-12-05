package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.Bill;
import com.example.bee_shirt.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BillDetailRepository extends JpaRepository<BillDetail,Integer> {
    @Query("SELECT bd FROM BillDetail bd WHERE bd.codeBillDetail LIKE :query")
    BillDetail findBillDetailByCode(String query);

    @Query("SELECT bd FROM BillDetail bd WHERE bd.bill.codeBill LIKE :query AND bd.statusBillDetail = :status")
    List<BillDetail> findBillDetailByBillCodeAndStatusBillDetail(String query, Integer status);

    @Query("SELECT bd FROM BillDetail bd WHERE bd.bill.codeBill LIKE :codeBill AND bd.shirtDetail.codeShirtDetail like :codeShirtDetail AND bd.statusBillDetail = :status")
    BillDetail findBillDetailByCodeBillAndCodeShirtDetailAndStatusBillDetail(String codeBill, String codeShirtDetail, Integer status);


}
