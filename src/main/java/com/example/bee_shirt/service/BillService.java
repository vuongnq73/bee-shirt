package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.BillDTO;
import com.example.bee_shirt.dto.request.RevenueDTO;
import com.example.bee_shirt.repository.BillRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {

    BillRepo billRepository;

    // Method to fetch all Bill Summaries
    public List<BillDTO> getAllBillSummaries() {
        List<Object[]> results = billRepository.findBillSummaryNative();

        return results.stream().map(result -> new BillDTO(
                (String) result[0],                      // codeBill
                (String) result[1],
                (String) result[2],                      // codeBill
                (String) result[3], // customerName
                result[4] != null ? ((Date) result[4]).toLocalDate() : null,   // desiredDate, convert sql Date to LocalDate
                (String) result[5],                      // namePaymentMethod
                (BigDecimal) result[6],                  // totalMoney
                (Integer) result[7]                      // statusBill
        )).collect(Collectors.toList());
    }

    // New method for Bill statistics

    public List<RevenueDTO> getAllBillStatics() {
        // Gọi Repository với các tham số
        List<Object[]> results = billRepository.findBillStatisticsNative();

        // Chuyển đổi kết quả query thành danh sách DTO
        return results.stream().map(result -> new RevenueDTO(
                ((Number) result[0]).intValue(),       // BillCount (số hóa đơn)
                ((Number) result[1]).intValue(),       // TotalShirtQuantity (tổng số sản phẩm)
                (BigDecimal) result[2]                  // TotalRevenue (doanh thu)
        )).collect(Collectors.toList());
    }
}
