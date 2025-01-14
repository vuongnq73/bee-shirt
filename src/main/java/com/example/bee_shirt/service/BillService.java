package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.request.*;
import com.example.bee_shirt.entity.Bill;
import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import com.example.bee_shirt.repository.BillDetailRepository;
import com.example.bee_shirt.repository.BillRepo;
import com.example.bee_shirt.repository.BillRepository;
import com.example.bee_shirt.repository.ShirtDetailRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {

    BillRepo billRepository;
    BillRepository billrepo;

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
                (Integer) result[7],                   // statusBill
                  (String) result[8]
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
                (Integer) result[7] ,                     // statusBill
                (String) result[8]
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
                (Integer) result[7] ,                     // statusBill
                (String) result[8]
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


    public boolean updateStatus(String codeBill, int statusBill, String notes) {
        // Tìm hóa đơn dựa vào mã codeBill
        Optional<Bill> billOptional = billRepository.findByCodeBill(codeBill);

        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();

            // Cập nhật trạng thái hóa đơn
            bill.setStatusBill(statusBill);
            bill.setNotes(notes);
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
    // lấy danh sách đươn hàng của client có tran thái là 1(chờ xử lý)

    public List<MyOderDTO> getBillsByCustomerIdAndStatus(Integer customerId) {
        List<Object[]> results = billRepository.findByCustomerIdAndStatusNative(customerId);

        return results.stream().map(result -> new MyOderDTO(
                result[0].toString(),                                // codeBill
                new Date(((java.sql.Date) result[1]).getTime()),     // createDate
                Double.parseDouble(result[2].toString()),            // totalMoney
                Integer.parseInt(result[3].toString())               // statusBill
        )).collect(Collectors.toList());
    }
    // lấy danh sách đươn hàng của client có tran thái là 3( chờ Đang Giao Hàng)

    public List<MyOderDTO> getBillsByCustomerIdAndStatus2(Integer customerId) {
        List<Object[]> results = billRepository.findByCustomerIdAndStatusNative2(customerId);

        return results.stream().map(result -> new MyOderDTO(
                result[0].toString(),                                // codeBill
                new Date(((java.sql.Date) result[1]).getTime()),     // createDate
                Double.parseDouble(result[2].toString()),            // totalMoney
                Integer.parseInt(result[3].toString())               // statusBill
        )).collect(Collectors.toList());
    }
    // lấy danh sách đươn hàng của client có tran thái là 4(Đang Giao Hàng)
    public List<MyOderDTO> getBillsByCustomerIdAndStatus3(Integer customerId) {
        List<Object[]> results = billRepository.findByCustomerIdAndStatusNative3(customerId);

        return results.stream().map(result -> new MyOderDTO(
                result[0].toString(),                                // codeBill
                new Date(((java.sql.Date) result[1]).getTime()),     // createDate
                Double.parseDouble(result[2].toString()),            // totalMoney
                Integer.parseInt(result[3].toString())               // statusBill
        )).collect(Collectors.toList());
    }
    // lấy danh sách đươn hàng của client có tran thái là 5,6(hoàn tất,tahnh toán)
    public List<MyOderDTO> getBillsByCustomerIdAndStatus4(Integer customerId) {
        List<Object[]> results = billRepository.findByCustomerIdAndStatusNative4(customerId);

        return results.stream().map(result -> new MyOderDTO(
                result[0].toString(),                                // codeBill
                new Date(((java.sql.Date) result[1]).getTime()),     // createDate
                Double.parseDouble(result[2].toString()),            // totalMoney
                Integer.parseInt(result[3].toString())               // statusBill
        )).collect(Collectors.toList());
    }
    // lấy danh sách đươn hàng của client có tran thái là 7(Hủyddown)
    public List<MyOderDTO> getBillsByCustomerIdAndStatus5(Integer customerId) {
        List<Object[]> results = billRepository.findByCustomerIdAndStatusNative5(customerId);

        return results.stream().map(result -> new MyOderDTO(
                result[0].toString(),                                // codeBill
                new Date(((java.sql.Date) result[1]).getTime()),     // createDate
                Double.parseDouble(result[2].toString()),            // totalMoney
                Integer.parseInt(result[3].toString())               // statusBill
        )).collect(Collectors.toList());
    }
    //lấy danh sách đơn hàng sau khi xác nhâận mail
    public List<MyOderDTO> getOrdersByEmail(String email) {
        List<Object[]> results = billRepository.findByEmail(email);

        return results.stream().map(result -> new MyOderDTO(
                result[0].toString(),                                // codeBill
                new java.util.Date(((java.sql.Date) result[1]).getTime()), // createDate
                Double.parseDouble(result[2].toString()),            // totalMoney
                Integer.parseInt(result[3].toString())               // statusBill
        )).collect(Collectors.toList());
    }
//
public List<MyOderDTO> getBillsByEmailAndStatus1(String email) {
    List<Object[]> results = billRepository.findBillByEmail1(email);

    return results.stream().map(result -> new MyOderDTO(
            result[0].toString(),                                // codeBill
            new Date(((java.sql.Date) result[1]).getTime()),     // createDate
            Double.parseDouble(result[2].toString()),            // totalMoney
            Integer.parseInt(result[3].toString())               // statusBill
    )).collect(Collectors.toList());
}
//
public List<MyOderDTO> getBillsByEmailAndStatus2(String email) {
    List<Object[]> results = billRepository.findBillByEmail2(email);

    return results.stream().map(result -> new MyOderDTO(
            result[0].toString(),                                // codeBill
            new Date(((java.sql.Date) result[1]).getTime()),     // createDate
            Double.parseDouble(result[2].toString()),            // totalMoney
            Integer.parseInt(result[3].toString())               // statusBill
    )).collect(Collectors.toList());
}
//
public List<MyOderDTO> getBillsByEmailAndStatus3(String email) {
    List<Object[]> results = billRepository.findBillByEmail3(email);

    return results.stream().map(result -> new MyOderDTO(
            result[0].toString(),                                // codeBill
            new Date(((java.sql.Date) result[1]).getTime()),     // createDate
            Double.parseDouble(result[2].toString()),            // totalMoney
            Integer.parseInt(result[3].toString())               // statusBill
    )).collect(Collectors.toList());
}
//
public List<MyOderDTO> getBillsByEmailAndStatus4(String email) {
    List<Object[]> results = billRepository.findBillByEmail4(email);

    return results.stream().map(result -> new MyOderDTO(
            result[0].toString(),                                // codeBill
            new Date(((java.sql.Date) result[1]).getTime()),     // createDate
            Double.parseDouble(result[2].toString()),            // totalMoney
            Integer.parseInt(result[3].toString())               // statusBill
    )).collect(Collectors.toList());
}
//
public List<MyOderDTO> getBillsByEmailAndStatus5(String email) {
    List<Object[]> results = billRepository.findBillByEmail5(email);

    return results.stream().map(result -> new MyOderDTO(
            result[0].toString(),                                // codeBill
            new Date(((java.sql.Date) result[1]).getTime()),     // createDate
            Double.parseDouble(result[2].toString()),            // totalMoney
            Integer.parseInt(result[3].toString())               // statusBill
    )).collect(Collectors.toList());
}
//
@Autowired
private BillDetailRepository billDetailRepository;

    @Autowired
    private ShirtDetailRepository shirtDetailRepository;

    @Transactional
    public boolean updateProductStock(String codeBillDetail, Integer newQuantity) {
        // Lấy chi tiết hóa đơn
        BillDetail billDetail = billDetailRepository.findBillDetailByCode(codeBillDetail);
        if (billDetail == null || billDetail.getBill() == null) {
            return false; // Không tìm thấy chi tiết hóa đơn hoặc hóa đơn không hợp lệ
        }
        // Kiểm tra trạng thái hóa đơn (chỉ xử lý nếu trạng thái là 6)
        if (billDetail.getBill().getStatusBill() != 6) {
            return false; // Trạng thái hóa đơn không phù hợp
        }
        // Lấy chi tiết áo
        ShirtDetail shirtDetail = billDetail.getShirtDetail();
        if (shirtDetail == null) {
            return false; // Không tìm thấy chi tiết áo
        }
        // Lấy số lượng cũ và tồn kho hiện tại
        Integer oldQuantity = billDetail.getQuantity();
        Integer stockQuantity = shirtDetail.getQuantity();
        // Tính chênh lệch số lượng
        int quantityDelta = newQuantity - oldQuantity;
        // Kiểm tra tồn kho (đảm bảo không bị âm)
        if (stockQuantity - quantityDelta < 0) {
            return false; // Không đủ hàng trong kho
        }
        // Cập nhật số lượng trong hóa đơn
        billDetail.setQuantity(newQuantity);
        billDetailRepository.save(billDetail);
        // Cập nhật số lượng trong kho
        shirtDetail.setQuantity(stockQuantity - quantityDelta);
        shirtDetailRepository.save(shirtDetail);
        return true; // Cập nhật thành công
    }

//    lo theo khoảng thoeif gian
public List<Map<String, Object>> getBillsByDateRange(String startDate, String endDate) {
    List<Object[]> results = billRepository.findBillsByDateRange(startDate, endDate);

    // Chuyển đổi kết quả thành danh sách Map
    List<Map<String, Object>> bills = new ArrayList<>();
    for (Object[] row : results) {
        Map<String, Object> bill = new HashMap<>();
        bill.put("codeBill", row[0]);
        bill.put("customerName", row[1]);
        bill.put("phoneNumber", row[2]);
        bill.put("typeBill", row[3]);
        bill.put("createAt", row[4]);
        bill.put("paymentMethod", row[5]);
        bill.put("totalMoney", row[6]);
        bill.put("statusBill", row[7]);
        bill.put("note", row[8]);

        bills.add(bill);
    }

    return bills;
}
//lọc cho tab2
public List<Map<String, Object>> getBillsByDateRange2(String startDate, String endDate) {
    List<Object[]> results = billRepository.findBillsByDateRange2(startDate, endDate);

    // Chuyển đổi kết quả thành danh sách Map
    List<Map<String, Object>> bills = new ArrayList<>();
    for (Object[] row : results) {
        Map<String, Object> bill = new HashMap<>();
        bill.put("codeBill", row[0]);
        bill.put("customerName", row[1]);
        bill.put("phoneNumber", row[2]);
        bill.put("typeBill", row[3]);
        bill.put("createAt", row[4]);
        bill.put("paymentMethod", row[5]);
        bill.put("totalMoney", row[6]);
        bill.put("statusBill", row[7]);
        bill.put("note", row[8]);

        bills.add(bill);
    }

    return bills;
}

    //lọc cho tab3
    public List<Map<String, Object>> getBillsByDateRange3(String startDate, String endDate) {
        List<Object[]> results = billRepository.findBillsByDateRange3(startDate, endDate);

        // Chuyển đổi kết quả thành danh sách Map
        List<Map<String, Object>> bills = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> bill = new HashMap<>();
            bill.put("codeBill", row[0]);
            bill.put("customerName", row[1]);
            bill.put("phoneNumber", row[2]);
            bill.put("typeBill", row[3]);
            bill.put("createAt", row[4]);
            bill.put("paymentMethod", row[5]);
            bill.put("totalMoney", row[6]);
            bill.put("statusBill", row[7]);
            bill.put("note", row[8]);

            bills.add(bill);
        }

        return bills;
    }

}
