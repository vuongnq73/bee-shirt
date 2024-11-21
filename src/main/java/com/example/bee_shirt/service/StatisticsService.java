package com.example.bee_shirt.service;

import com.example.bee_shirt.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class StatisticsService {

    @Autowired
    private BillRepository billRepository;

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
        List<Object[]> result = billRepository.findBillStatisticsForCurrentWeek();
        return result.isEmpty() ? Collections.emptyList() : result;
    }

    // Thống kê theo tháng trước
    public List<Object[]> getStatisticsForLastMonth() {
        List<Object[]> result = billRepository.findBillStatisticsForLastMonth();
        return result.isEmpty() ? Collections.emptyList() : result;
    }
}
