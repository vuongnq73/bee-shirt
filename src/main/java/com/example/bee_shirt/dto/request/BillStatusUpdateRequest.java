package com.example.bee_shirt.dto.request;

public class BillStatusUpdateRequest {
    private String codeBill; // Mã hóa đơn
    private int statusBill;  // Trạng thái hóa đơn

    // Getter và Setter
    public String getCodeBill() {
        return codeBill;
    }

    public void setCodeBill(String codeBill) {
        this.codeBill = codeBill;
    }

    public int getStatusBill() {
        return statusBill;
    }

    public void setStatusBill(int statusBill) {
        this.statusBill = statusBill;
    }

    // Constructor không tham số (nếu cần)
    public BillStatusUpdateRequest() {
    }

    // Constructor có tham số (nếu cần)
    public BillStatusUpdateRequest(String codeBill, int statusBill) {
        this.codeBill = codeBill;
        this.statusBill = statusBill;
    }
}
