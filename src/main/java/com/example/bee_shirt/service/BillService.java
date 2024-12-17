package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.BillDTO;
import com.example.bee_shirt.dto.request.BillSummaryDTO;
import com.example.bee_shirt.dto.request.RevenueDTO;
import com.example.bee_shirt.entity.Bill;
import com.example.bee_shirt.repository.BillRepo;
import com.example.bee_shirt.repository.BillRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;
import java.util.Optional;
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
    //listBill có trạng thái là 2
    public List<BillDTO> getAllBillSummaries2() {
        List<Object[]> results = billRepository.findBillSummaryNative2();

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
    //ListBill có trạng thái là 3
    public List<BillDTO> getAllBillSummaries3() {
        List<Object[]> results = billRepository.findBillSummaryNative3();

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
                ((Number) result[0]).intValue(),  // BillCount (số hóa đơn)
                result[1] != null ? ((Number) result[1]).intValue() : 0,  // TotalShirtQuantity (tổng số sản phẩm)
                result[2] != null ? (BigDecimal) result[2] : BigDecimal.ZERO  // TotalRevenue (doanh thu)
        )).collect(Collectors.toList());
    }


    public boolean updateStatus(String codeBill, int statusBill) {
        // Tìm hóa đơn dựa vào mã codeBill
        Optional<Bill> billOptional = billRepository.findByCodeBill(codeBill);

        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();

            // Cập nhật trạng thái hóa đơn
            bill.setStatusBill(statusBill);

            // Lưu thay đổi vào cơ sở dữ liệu
            billRepository.save(bill);
            return true;
        } else {
            // Không tìm thấy hóa đơn
            return false;
        }
    }
    public BillSummaryDTO getBillSummary(Date startDate, Date endDate) {
        List<Object[]> results = billRepository.getBillSummaryRaw(startDate, endDate);
        Object[] result = results.get(0); // Assuming there's only one result

        Integer totalOrderInStore = (Integer) result[0];
        Integer totalOrderOnline = (Integer) result[1];
        Integer billCount = (Integer) result[2];
        Integer totalShirtQuantity = (Integer) result[3];
        BigDecimal totalRevenue = (BigDecimal) result[4];
        BigDecimal TotalInstoreMoney = (BigDecimal) result[5];
        BigDecimal TotalOnlineMoney = (BigDecimal) result[6];
        return new BillSummaryDTO(totalOrderInStore, totalOrderOnline, billCount, totalShirtQuantity, totalRevenue,TotalOnlineMoney,TotalInstoreMoney);
    }

}
