package com.example.bee_shirt.repository;


import com.example.bee_shirt.dto.request.BillDetailDTO;
import com.example.bee_shirt.entity.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillDetailrepo extends JpaRepository<BillDetail, Integer> {

    @Query(value = "SELECT sd.image AS nameImage, " +
            "s.name_shirt AS nameShirt, " +
            "b.name_brand AS nameBrand, " +
            "sz.name_size AS nameSize, " +
            "bd.quantity AS quantity, " +
            "bd.price AS price, " +
            "v.name_voucher AS nameVoucher, " +
            "bl.subtotal_before_discount AS subtotalBeforeDiscount, " +
            "bl.total_money AS totalMoney, " +
            "bl.customer_name AS customerName, " +
            "bl.address_customer AS addressCustomer, " +
            "bl.phone_number AS phoneNumber, " +
            "bl.money_reduce AS moneyReduce " +
            "FROM bill_detail bd " +
            "LEFT JOIN bill bl ON bd.bill_id = bl.id " +
            "LEFT JOIN shirt_detail sd ON bd.shirt_detail_id = sd.id " +
            "LEFT JOIN shirt s ON sd.shirt_id = s.id " +
            "LEFT JOIN brand b ON s.brand_id = b.id " +
            "LEFT JOIN size sz ON sd.size_id = sz.id " +
            "LEFT JOIN account cus ON cus.id = bl.customer_id " +
            "LEFT JOIN voucher v ON bl.voucher_id = v.id " +
            "WHERE bl.code_bill = :codeBill", // Sử dụng :codeBill cho tham số truy vấn
            nativeQuery = true)
    List<Object[]> findBillDetailsByCodeBill(@Param("codeBill") String codeBill);

//BillDetails TimeLine
@Query(value = """
    SELECT 
        bl.code_bill AS codeBill,
        bl.create_at AS createAt,
        bl.create_by AS createBy,
        bl.customer_name AS customerName, 
        bl.address_customer AS addressCustomer, 
        bl.phone_number AS phoneNumber, 
        sd.image AS nameImage, 
        s.name_shirt AS nameShirt, 
        b.name_brand AS nameBrand, 
        sz.name_size AS nameSize, 
        bd.quantity AS quantity, 
        bd.price AS price, 
        v.name_voucher AS nameVoucher, 
        bl.money_ship AS moneyShip,
        bl.desired_date AS desiredDate,
        bl.subtotal_before_discount AS subtotalBeforeDiscount, 
        bl.total_money AS totalMoney,
        bl.type_bill AS TypeBill,
        bl.note AS note,
        bl.status_bill as StatusBill,
        bl.money_reduce AS moneyReduce 
    FROM bill_detail bd 
    JOIN bill bl ON bd.bill_id = bl.id 
    JOIN shirt_detail sd ON bd.shirt_detail_id = sd.id 
    JOIN shirt s ON sd.shirt_id = s.id 
    JOIN brand b ON s.brand_id = b.id 
    JOIN size sz ON sd.size_id = sz.id 
    LEFT JOIN voucher v ON bl.voucher_id = v.id 
    WHERE bl.code_bill = :codeBill
""", nativeQuery = true)
List<Object[]> findBillDetailsByCodeBillTimeLine(@Param("codeBill") String codeBill);
//


}
