package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.MyOderDTO;
import com.example.bee_shirt.entity.Bill;
import com.example.bee_shirt.service.BillService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("myOder") // Đường dẫn theo kiểu RESTful
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MyOderCotroller {
    @Autowired
    private BillService billService;
//danh sách caác đơn hàng của client có trạng thái là đang ch xử lsy và xa nahanj
    @GetMapping("/list1/{customerId}")
    public ResponseEntity<List<MyOderDTO>> getBills(@PathVariable Integer customerId) {
        List<MyOderDTO> bills = billService.getBillsByCustomerIdAndStatus(customerId);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
//danh sách caác đơn hàng của client có trạng thái là chờ  giao

    @GetMapping("/list2/{customerId}")
    public ResponseEntity<List<MyOderDTO>> getBills2(@PathVariable Integer customerId) {
        List<MyOderDTO> bills = billService.getBillsByCustomerIdAndStatus2(customerId);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
//danh sách caác đơn hàng của client có trạng thái là dang giao
    @GetMapping("/list3/{customerId}")
    public ResponseEntity<List<MyOderDTO>> getBills3(@PathVariable Integer customerId) {
        List<MyOderDTO> bills = billService.getBillsByCustomerIdAndStatus3(customerId);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
//danh sách caác đơn hàng của client có trạng thái là đang hoàn tất, thanh toán

    @GetMapping("/list4/{customerId}")
    public ResponseEntity<List<MyOderDTO>> getBills4(@PathVariable Integer customerId) {
        List<MyOderDTO> bills = billService.getBillsByCustomerIdAndStatus4(customerId);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
//danh sách caác đơn hàng của client có trạng thái là đã hủy

    @GetMapping("/list5/{customerId}")
    public ResponseEntity<List<MyOderDTO>> getBills5(@PathVariable Integer customerId) {
        List<MyOderDTO> bills = billService.getBillsByCustomerIdAndStatus5(customerId);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
}
