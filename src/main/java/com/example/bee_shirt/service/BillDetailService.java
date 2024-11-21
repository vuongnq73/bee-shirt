package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.BillDetailDTO;
import com.example.bee_shirt.repository.BillDetailrepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillDetailService {

    BillDetailrepo billDetailRepo;

    public List<BillDetailDTO> getBillDetails(String codeBill) {

        List<Object[]> results = billDetailRepo.findBillDetailsByCodeBill(codeBill);
        return results.stream().map(result -> new BillDetailDTO(
                (String) result[0],      // Main_Image
                (String) result[1],      // Product_Name
                (String) result[2],      // Brand_Name
                (String) result[3],      // Size
                (Integer) result[4],     // Quantity
                ((BigDecimal) result[5]).doubleValue(), // Price_Per_Product
                (String) result[6],      // Voucher_Name
                ((BigDecimal) result[7]).doubleValue(), // Price_Before_Discount
                ((BigDecimal) result[8]).doubleValue(), // Total_Amount
                (String) result[9],      // Customer_Name
                (String) result[10],     // Address_Customer
                (String) result[11]      // Phone_Number
        )).collect(Collectors.toList());
    }


}
