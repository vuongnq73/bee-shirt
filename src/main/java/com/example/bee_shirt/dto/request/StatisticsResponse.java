package com.example.bee_shirt.dto.request;
import java.util.List;

public class StatisticsResponse {


    private List<String> labels;       // Nhãn trục x
    private List<Integer> shirtData;  // Số lượng sản phẩm
    private List<Integer> revenueData; // Doanh thu
    private List<Integer> orderData;  // Số lượng đơn hàng

    // Constructor
    public StatisticsResponse(List<String> labels, List<Integer> shirtData, List<Integer> revenueData, List<Integer> orderData) {
        this.labels = labels;
        this.shirtData = shirtData;
        this.revenueData = revenueData;
        this.orderData = orderData;
    }

    // Getters và Setters
    public List<String> getLabels() {
        return labels;
    }

    public void setLabels(List<String> labels) {
        this.labels = labels;
    }

    public List<Integer> getShirtData() {
        return shirtData;
    }

    public void setShirtData(List<Integer> shirtData) {
        this.shirtData = shirtData;
    }

    public List<Integer> getRevenueData() {
        return revenueData;
    }

    public void setRevenueData(List<Integer> revenueData) {
        this.revenueData = revenueData;
    }

    public List<Integer> getOrderData() {
        return orderData;
    }

    public void setOrderData(List<Integer> orderData) {
        this.orderData = orderData;
    }


}
