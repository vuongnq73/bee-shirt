package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.BestSalerDTO;
import com.example.bee_shirt.dto.request.BillStaticsDTO;
import com.example.bee_shirt.repository.BIllStaticsRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillStaticsService {

    BIllStaticsRepo billStaticsRepository;






    // Hàm để lấy sản phẩm bán chạy nhất dựa trên số ngày từ ngày hiện tại
    public List<BestSalerDTO> getTopSellingProducts(int days) {
        // Tính toán startDate dựa trên số ngày
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -days); // Trừ đi số ngày tương ứng
        Date startDate = calendar.getTime();

        // Lấy danh sách sản phẩm bán chạy từ repository
        List<Object[]> result = billStaticsRepository.findTopSellingProducts(startDate);

        // Chuyển đổi từ Object[] thành BestSalerDTO
        List<BestSalerDTO> bestSalerDTOList = new ArrayList<>();
        for (Object[] row : result) {
            Integer productId = (Integer) row[0];  // productId
            String productName = (String) row[1];  // productName
            Integer totalQuantitySold = (Integer) row[2];  // totalQuantitySold
            BigDecimal totalRevenueBD = (BigDecimal) row[3];  // row[3] có thể là BigDecimal
            Double totalRevenue = totalRevenueBD.doubleValue();  // totalRevenue

            // Tạo đối tượng BestSalerDTO và thêm vào danh sách
            BestSalerDTO bestSalerDTO = new BestSalerDTO(productId, productName, totalQuantitySold, totalRevenue);
            bestSalerDTOList.add(bestSalerDTO);
        }
        return bestSalerDTOList;
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

