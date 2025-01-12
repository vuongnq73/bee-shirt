package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.BillDetailDTO;
import com.example.bee_shirt.dto.request.BillDetailOnlineDTO;
import com.example.bee_shirt.repository.BillDetailrepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
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
                (String) result[11],     // Phone_Number
        ((BigDecimal) result[12]).doubleValue()
        )).collect(Collectors.toList());
    }
    public List<BillDetailOnlineDTO> getBillDetailsOnline(String codeBill) {
        // Lấy dữ liệu từ repository
        List<Object[]> results = billDetailRepo.findBillDetailsByCodeBillTimeLine(codeBill);

        // Ánh xạ từ Object[] sang DTO
        return results.stream()
                .map(result -> new BillDetailOnlineDTO(
                        (String) result[0],                                   // codeBill
                        (Date) result[1],                                    // createAt
                        (String) result[2],                                  // createBy
                        (String) result[3],                                  // customerName
                        (String) result[4],                                  // addressCustomer
                        (String) result[5],                                  // phoneNumber
                        (String) result[6],                                  // nameImage
                        (String) result[7],                                  // nameShirt
                        (String) result[8],                                  // nameBrand
                        (String) result[9],                                  // nameSize
                        (Integer) result[10],                                // quantity
                        (BigDecimal) result[11],                             // price
                        (String) result[12],                                 // nameVoucher
                        (BigDecimal) result[13],                             // moneyShip
                        (Date) result[14],                                   // desiredDate
                        (BigDecimal) result[15],                             // subtotalBeforeDiscount
                        (BigDecimal) result[16],                             // totalMoney
                        (String) result[17],                                 // typeBill
                        (String) result[18] ,
                        (Integer) result[19],
                        (BigDecimal) result[20],
                        (String) result[21]

                        // note
                ))
                .collect(Collectors.toList());
    }

}
