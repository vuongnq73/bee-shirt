package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.BillStaticsDTO;
import com.example.bee_shirt.dto.request.RevenueDTO;
import com.example.bee_shirt.dto.request.StatisticsResponse;
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
    @GetMapping("/filterBestSaler")
    public ApiResponse<List<BillStaticsDTO>> getBillStatics(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String shirtName,
            @RequestParam(required = false) String size
    ) {
        log.info("Fetching bill statistics for month: {}, year: {}, brand: {}, shirtName: {}, size: {}",
                month, year, brand, shirtName, size);

        List<BillStaticsDTO> statistics = billStaticsService.getBillStatics(brand, shirtName, size, month, year);

        log.info("Number of statistics records found: {}", statistics.size());

        return ApiResponse.<List<BillStaticsDTO>>builder()
                .code(1000)
                .result(statistics)
                .build();
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
        // Nếu `dateFilter` là null hoặc trống, gán giá trị mặc định
        if (dateFilter == null || dateFilter.isEmpty()) {
            dateFilter = "this-month"; // Giá trị mặc định
        }

        List<Object[]> statistics;

        // Xử lý các bộ lọc theo thời gian
        switch (dateFilter) {
            case "today":
                statistics = statisticsService.getStatisticsForToday();
                break;
            case "this-month":
                statistics = statisticsService.getStatisticsForCurrentMonth();
                break;
            case "this-week":
                statistics = statisticsService.getStatisticsForCurrentWeek();
                break;
            case "last-month":
                statistics = statisticsService.getStatisticsForLastMonth();
                break;
            default:
                // Nếu giá trị không hợp lệ, trả về lỗi hoặc mặc định là "this-month"
                return ResponseEntity.badRequest().body("Invalid date filter value: " + dateFilter);
        }

        // Kiểm tra nếu không có dữ liệu
        if (statistics.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Chuyển đổi dữ liệu thành định dạng JSON mà client yêu cầu
        Map<String, Object> response = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> shirtData = new ArrayList<>();
        List<Integer> revenueData = new ArrayList<>();
        List<Integer> orderData = new ArrayList<>();

        // Duyệt qua dữ liệu trả về
        for (Object[] row : statistics) {
            // Giả sử dữ liệu trả về theo dạng [label, shirtQuantity, revenue, orderCount]
            labels.add(row[0].toString());

            // Lấy giá trị số lượng áo và chuyển đổi từ BigDecimal sang Integer nếu cần
            shirtData.add(row[1] != null ? ((BigDecimal) row[1]).intValue() : 0); // Kiểm tra null và ép kiểu

            // Lấy giá trị doanh thu và chuyển đổi từ BigDecimal sang Integer
            revenueData.add(row[2] != null ? ((BigDecimal) row[2]).intValue() : 0);

            // Lấy giá trị số đơn hàng và chuyển đổi từ BigDecimal sang Integer
            orderData.add(row[3] != null ? ((BigDecimal) row[3]).intValue() : 0);
        }

        // Gửi lại dữ liệu dưới dạng JSON
        response.put("labels", labels);
        response.put("shirtData", shirtData);
        response.put("revenueData", revenueData);
        response.put("orderData", orderData);

        return ResponseEntity.ok(response);
    }

}
