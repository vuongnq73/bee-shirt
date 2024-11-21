package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.BillStaticsDTO;
import com.example.bee_shirt.repository.BIllStaticsRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillStaticsService {

    BIllStaticsRepo billStaticsRepository;

    public List<BillStaticsDTO> getBillStatics(String brand, String shirtName, String size, Integer month, Integer year) {
        // Gọi Repository với các tham số đã xử lý
        List<Object[]> results = billStaticsRepository.findBillStaticsNative(
                brand, shirtName, size, month, year
        );

        // Chuyển đổi kết quả query thành danh sách DTO
        return results.stream().map(result -> new BillStaticsDTO(
                (String) result[0],          // brand
                (String) result[1],          // shirtName
                (String) result[2],          // size
                result[3] != null ? ((Number) result[3]).longValue() : 0L // totalQuantitySold
        )).collect(Collectors.toList());
    }


    public List<BillStaticsDTO> getAllBillStatics() {
        // Gọi Repository với các tham số
        List<Object[]> results = billStaticsRepository.findAllSticsBestSaler();

        // Chuyển đổi kết quả query thành danh sách DTO
        return results.stream().map(result -> new BillStaticsDTO(
                (String) result[0],          // brand
                (String) result[1],          // shirtName
                (String) result[2],          // size
                result[3] != null ? ((Number) result[3]).longValue() : 0L // totalQuantitySold
        )).collect(Collectors.toList());
    }
}

