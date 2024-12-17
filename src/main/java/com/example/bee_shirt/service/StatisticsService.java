package com.example.bee_shirt.service;

import com.example.bee_shirt.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatisticsService {

    @Autowired
    private BillRepository billRepository;

    public List<Object[]> getStatisticsForToDayInStoreAndOnline() {
        List<Object[]> result = billRepository.findTotalBillsByType();
        return result.isEmpty() ? Collections.emptyList() : result;
    }
    public List<Object[]> getOrderForToDayInStoreAndOnline() {
        List<Object[]> result = billRepository.getOrderCounts();
        return result.isEmpty() ? Collections.emptyList() : result;
    }

    // Thống kê theo ngày hôm nay
    public List<Object[]> getStatisticsForToday() {
        List<Object[]> result = billRepository.findBillStatisticsForToday();
        return result.isEmpty() ? Collections.emptyList() : result;
    }

    // Thống kê theo tháng hiện tại
    public List<Object[]> getStatisticsForCurrentMonth() {
        List<Object[]> result = billRepository.findBillStatisticsForCurrentMonth();
        return result.isEmpty() ? Collections.emptyList() : result;
    }

    // Thống kê theo tuần hiện tại
    public List<Object[]> getStatisticsForCurrentWeek() {
        return billRepository.findBillStatisticsForCurrentWeek();
    }


    // Thống kê theo tháng trước
    public List<Object[]> getStatisticsForLastMonth() {
        List<Object[]> result = billRepository.findBillStatisticsForLastMonth();
        return result.isEmpty() ? Collections.emptyList() : result;
    }
    // Thống kê theo năm hiện tại
    public List<Object[]> getStatisticsForCurrentYear() {
        List<Object[]> result = billRepository.findBillStatisticsForCurrentYear();
        return result.isEmpty() ? Collections.emptyList() : result;
    }
    //thống kê doanh thu tại cửa hàng và online theo ngày
    public List<Object[]> getStatisticsForToDayy(){
        List<Object[]> result = billRepository.findBillStatisticsForTodayy();
        return result.isEmpty()? Collections.emptyList() : result;
    }
//thống kê doanh thu tại cửa hàng và online theo 7 ngày gâ nhất
public List<Object[]> getStatisticsForLast7Days(){
        List<Object[]> result = billRepository.findBillStatisticsForLast7Days();
        return result.isEmpty()? Collections.emptyList() : result;

}
    //thống kê doanh thu tại cửa hàng và online theo tháng
    public List<Object[]> findBillStatisticsForMonth(){
        List<Object[]> result = billRepository.findBillStatisticsForLast30Days();
        return result.isEmpty()? Collections.emptyList() : result;
    }


    //thống kê doanh thu tại cửa hàng và online theo năm
    public List<Object[]> findBillStatisticsForYear(){
        List<Object[]> result = billRepository.findBillStatisticsForCurrentYearr();
        return result.isEmpty()? Collections.emptyList() : result;
    }
    public List<Object[]> findTotalBillsByType(){
        List<Object[]> result = billRepository.findTotalBillsByType();
        return result.isEmpty()? Collections.emptyList() : result;
    }
    //

    public Map<String, Object> getStatisticsByCustomTime(String startDate, String endDate, int statusBill) {
        List<Object[]> rawResults = billRepository.findBillStatisticsByCustomTime(startDate, endDate, statusBill);

        // Tạo Map chứa kết quả
        Map<String, Object> result = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> orderData = new ArrayList<>();
        List<Integer> shirtData = new ArrayList<>();
        List<Double> revenueData = new ArrayList<>();

        // Duyệt qua rawResults và thêm vào danh sách
        for (Object[] row : rawResults) {
            labels.add((String) row[0]); // labels
            orderData.add(((Number) row[1]).intValue()); // totalOrders
            shirtData.add(((Number) row[2]).intValue()); // totalShirtQuantity
            revenueData.add(((Number) row[3]).doubleValue()); // totalRevenue
        }

        // Đưa các danh sách vào Map
        result.put("labels", labels);
        result.put("orderData", orderData);
        result.put("shirtData", shirtData);
        result.put("revenueData", revenueData);

        return result;
    }}
