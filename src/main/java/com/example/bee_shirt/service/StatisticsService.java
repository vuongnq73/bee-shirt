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
}
