package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.*;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.repository.BillRepository;
import com.example.bee_shirt.service.BillService;
import com.example.bee_shirt.service.BillStaticsService;
import com.example.bee_shirt.service.StatisticsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("statics") // Đường dẫn theo kiểu RESTful
@CrossOrigin(origins = "http://127.0.0.1:5501")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StaticsController {
    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private BillRepository billrepo;

    @Autowired
    private BillService billService;

    @Autowired
    private BillStaticsService billStaticsService;
    // API thống kê sản phẩm bán chạy
//Api Thong ke san pham ban chay


    @GetMapping("/filter")
    public List<BestSalerDTO> getTopSellingProducts(@RequestParam("timeFilter") String timeFilter) {
        // Chuyển thời gian lọc từ chuỗi thành số nguyên (ngày)
        int days = Integer.parseInt(timeFilter);
        return billStaticsService.getTopSellingProducts(days);
    }


    // Lấy tất cả thống kê hóa đơn
    @GetMapping("/list")
    public ApiResponse<List<BillStaticsDTO>> getAllBillStatics() {
        List<BillStaticsDTO> statisticsAll = billStaticsService.getAllBillStatics();
        log.info("Number of statistics records found: {}", statisticsAll.size());

        return ApiResponse.<List<BillStaticsDTO>>builder()
                .code(1000)
                .result(statisticsAll)
                .build();
    }

    // Thống kê doanh thu
    @GetMapping("/revenue")
    public ApiResponse<List<RevenueDTO>> getBillStatics() {
        // Truyền các tham số động nhận từ API vào service
        List<RevenueDTO> statisticsAll = billService.getAllBillStatics(); // Đảm bảo gọi phương thức đúng
        log.info("Number of statistics records found: {}", statisticsAll.size());

        return ApiResponse.<List<RevenueDTO>>builder() // Sử dụng RevenueDTO thay vì BillStaticsDTO
                .code(1000)
                .result(statisticsAll)
                .build();
    }
    // Thống kê theo tháng trong năm
    @GetMapping("/filterStatics")
    public Map<String, Object> getStatistics() {
        // Labels (tháng)
        List<String> labels = Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

        // Lấy dữ liệu từ database
        List<Object[]> quantityData = billrepo.getTotalQuantityByMonth();
        List<Object[]> revenueData = billrepo.getTotalRevenueByMonth();
        List<Object[]> ordersData = billrepo.getTotalOrdersByMonth();

        // Dữ liệu cho biểu đồ
        Map<String, Object> dataset1 = new HashMap<>();
        dataset1.put("label", "Số Sản Phẩm");
        dataset1.put("data", processMonthlyData(quantityData));

        Map<String, Object> dataset2 = new HashMap<>();
        dataset2.put("label", "Doanh Thu");
        dataset2.put("data", processMonthlyData(revenueData));

        Map<String, Object> dataset3 = new HashMap<>();
        dataset3.put("label", "Số Đơn Hàng");
        dataset3.put("data", processMonthlyData(ordersData));

        // Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("datasets", Arrays.asList(dataset1, dataset2, dataset3));

        return response;
    }

    // Hàm xử lý dữ liệu trả về từ query để tạo mảng theo tháng (1-12)
    private List<Integer> processMonthlyData(List<Object[]> data) {
        List<Integer> result = new ArrayList<>(Collections.nCopies(12, 0));
        for (Object[] row : data) {
            int month = (int) row[0] - 1;  // Lấy tháng (từ 1-12, điều chỉnh về chỉ số 0-11)
            int value = ((Number) row[1]).intValue();
            result.set(month, value); // Gán giá trị cho tháng tương ứng
        }
        return result;
    }
    private StatisticsResponse mapToStatisticsResponse(List<Object[]> rawStatistics) {
        // Khởi tạo danh sách cho dữ liệu
        List<String> labels = new ArrayList<>();
        List<Integer> shirtData = new ArrayList<>();
        List<Integer> revenueData = new ArrayList<>();
        List<Integer> orderData = new ArrayList<>();

        // Chuyển đổi từ Object[] thành danh sách các giá trị cần thiết
        for (Object[] record : rawStatistics) {
            labels.add(String.valueOf(record[0]));               // Chuyển đổi thành String an toàn
            shirtData.add(((Number) record[1]).intValue());      // Chuyển đổi thành Integer
            revenueData.add(((Number) record[2]).intValue());    // Chuyển đổi thành Integer
            orderData.add(((Number) record[3]).intValue());      // Chuyển đổi thành Integer
        }

        // Trả về DTO với dữ liệu đã chuyển đổi
        return new StatisticsResponse(labels, shirtData, revenueData, orderData);
    }


    // API thống kê theo thời gian (ngày, tuần, tháng, năm)


    @GetMapping("/filterByTime")
    public ResponseEntity<?> getStatistics(@RequestParam(value = "date", required = false) String dateFilter) {
        if (dateFilter == null || dateFilter.isEmpty()) {
            dateFilter = "this-month"; // Giá trị mặc định
        }

        System.out.println("Date filter received: " + dateFilter); // Log tham số nhận được

        List<Object[]> statistics;

        // Xử lý các bộ lọc theo thời gian
        switch (dateFilter) {
            case "today":
                statistics = statisticsService.getStatisticsForToday();
                break;
            case "this-month":
                statistics = statisticsService.getStatisticsForCurrentMonth();
                break;
            case "this-week": // Lọc theo tuần
                statistics = statisticsService.getStatisticsForCurrentWeek();
                break;
            case "last-month":
                statistics = statisticsService.getStatisticsForLastMonth();
                break;
            case "all": // Dữ liệu của năm hiện tại
                statistics = statisticsService.getStatisticsForCurrentYear();
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid date filter value: " + dateFilter);
        }

        if (statistics.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Chuẩn bị dữ liệu trả về
        Map<String, Object> response = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> orderData = new ArrayList<>();
        List<Integer> shirtData = new ArrayList<>();
        List<Double> revenueData = new ArrayList<>();

        for (Object[] row : statistics) {
            // Kiểm tra dữ liệu trong mỗi hàng
            if (row.length >= 4) {
                labels.add(row[0].toString()); // Ngày (label)
                orderData.add(row[1] != null ? ((Number) row[1]).intValue() : 0); // Tổng số đơn hàng
                shirtData.add(row[2] != null ? ((Number) row[2]).intValue() : 0); // Tổng số sản phẩm
                revenueData.add(row[3] != null ? ((Number) row[3]).doubleValue() : 0.0); // Tổng doanh thu
            } else {
                // Log nếu có dữ liệu lỗi hoặc thiếu
                System.out.println("Dữ liệu không đầy đủ: " + Arrays.toString(row));
            }
        }

        response.put("labels", labels);
        response.put("orderData", orderData);
        response.put("shirtData", shirtData);
        response.put("revenueData", revenueData);

        return ResponseEntity.ok(response);
    }

    // Thống kê tỉ lệ đơn hàng tại quầy và online
    @GetMapping("/InStoreAndOnline")
    public List<StatisticOrderIntoreAndOnline> getOrderForToDayInStoreAndOnline() {
        List<Object[]> rawData = statisticsService.getOrderForToDayInStoreAndOnline();
        return rawData.stream().map(data -> new StatisticOrderIntoreAndOnline(
                data[0] != null ? ((Number) data[0]).doubleValue() : 0.0, // TotalOnlineMoney
                data[1] != null ? ((Number) data[1]).doubleValue() : 0.0 // TotalInstoreMoney
        )).collect(Collectors.toList());
    }


    // Thống kê doanh thu tại cửa hàng và online theo ngày hôm nay
    @GetMapping("/Revenuetoday")
    public List<RevenueStatisticsDTO> getStatisticsForToday() {
        List<Object[]> rawData = statisticsService.getStatisticsForToDayInStoreAndOnline();
        return rawData.stream().map(data -> new RevenueStatisticsDTO(
                data[0] != null ? ((Number) data[0]).doubleValue() : 0.0, // TotalOnlineMoney
                data[1] != null ? ((Number) data[1]).doubleValue() : 0.0, // TotalInstoreMoney
                data[2] != null ? ((Number) data[2]).doubleValue() : 0.0  // TotalAllMoney
        )).collect(Collectors.toList());
    }

    // Thống kê doanh thu tại cửa hàng và online trong 7 ngày gần nhất
    @GetMapping("/last7days")
    public List<RevenueStatisticsDTO> getStatisticsForLast7Days() {
        List<Object[]> rawData = statisticsService.getStatisticsForLast7Days();
        return rawData.stream().map(data -> new RevenueStatisticsDTO(
                data[0] != null ? ((Number) data[0]).doubleValue() : 0.0, // TotalOnlineMoney
                data[1] != null ? ((Number) data[1]).doubleValue() : 0.0, // TotalInstoreMoney
                data[2] != null ? ((Number) data[2]).doubleValue() : 0.0  // TotalAllMoney
        )).collect(Collectors.toList());
    }

    // Thống kê doanh thu tại cửa hàng và online theo tháng hiện tại
    @GetMapping("/current-month")
    public List<RevenueStatisticsDTO> getStatisticsForMonth() {
        List<Object[]> rawData = statisticsService.findBillStatisticsForMonth();
        return rawData.stream().map(data -> new RevenueStatisticsDTO(
                data[0] != null ? ((Number) data[0]).doubleValue() : 0.0, // TotalOnlineMoney
                data[1] != null ? ((Number) data[1]).doubleValue() : 0.0, // TotalInstoreMoney
                data[2] != null ? ((Number) data[2]).doubleValue() : 0.0  // TotalAllMoney
        )).collect(Collectors.toList());
    }

    // Thống kê doanh thu tại cửa hàng và online theo năm hiện tại
    @GetMapping("/current-year")
    public List<RevenueStatisticsDTO> getStatisticsForYear() {
        List<Object[]> rawData = statisticsService.findBillStatisticsForYear();
        return rawData.stream().map(data -> new RevenueStatisticsDTO(
                data[0] != null ? ((Number) data[0]).doubleValue() : 0.0, // TotalOnlineMoney
                data[1] != null ? ((Number) data[1]).doubleValue() : 0.0, // TotalInstoreMoney
                data[2] != null ? ((Number) data[2]).doubleValue() : 0.0  // TotalAllMoney
        )).collect(Collectors.toList());
    }
//thống kê tỉ lệ đơn hàng mua online và mua tại quầy
@GetMapping("/statisticsInstoreAndOnline") // Endpoint để lấy thống kê
public ResponseEntity<List<Object[]>> getBillStatisticsByType() {
    List<Object[]> statistics = statisticsService.findTotalBillsByType();
    return ResponseEntity.ok(statistics); // Trả về kết quả dưới dạng JSON
}
}
