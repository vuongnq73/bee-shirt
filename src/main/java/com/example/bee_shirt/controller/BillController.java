package com.example.bee_shirt.controller;
import com.example.bee_shirt.dto.request.BillDTO;
import com.example.bee_shirt.entity.Bill;
import com.example.bee_shirt.repository.BillRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5501")
public class BillController {
    @Autowired
    BillRepo billrepo;
    @GetMapping("/bill/list")
    public List<BillDTO> getBill() {
        List<Bill> bills = billrepo.findAll();
        System.out.println("Số lượng hóa đơn: " + bills.size()); // Thêm log
        return bills.stream()
                .map(bill -> new BillDTO(bill.getCodeBill(), bill.getDesiredDate(), bill.getTotalMoney(), bill.getStatusBill()))
                .collect(Collectors.toList());
    }

}
