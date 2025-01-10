package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.request.MyOderDTO;
import com.example.bee_shirt.dto.response.ApiResponse;
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

@RequestMapping("myOderByEmail") // Đường dẫn theo kiểu RESTful
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MyOderByEmailController {
    @Autowired
    private BillService billService;
    //danh sách caác đơn hàng của client có trạng thái là đang ch xử lsy và xa nahanj

    //
    @GetMapping("/list1/{email}")
    public ResponseEntity<List<MyOderDTO>> getBillsByEmail1(@PathVariable String email) {
        List<MyOderDTO> bills = billService.getBillsByEmailAndStatus1(email);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
    //
    @GetMapping("/list2/{email}")
    public ResponseEntity<List<MyOderDTO>> getBillsByEmail2(@PathVariable String email) {
        List<MyOderDTO> bills = billService.getBillsByEmailAndStatus2(email);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
    //
    @GetMapping("/list3/{email}")
    public ResponseEntity<List<MyOderDTO>> getBillsByEmail3(@PathVariable String email) {
        List<MyOderDTO> bills = billService.getBillsByEmailAndStatus3(email);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
    //
    @GetMapping("/list4/{email}")
    public ResponseEntity<List<MyOderDTO>> getBillsByEmail4(@PathVariable String email) {
        List<MyOderDTO> bills = billService.getBillsByEmailAndStatus4(email);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
    //
    @GetMapping("/list5/{email}")
    public ResponseEntity<List<MyOderDTO>> getBillsByEmail5(@PathVariable String email) {
        List<MyOderDTO> bills = billService.getBillsByEmailAndStatus5(email);
        return new ResponseEntity<>(bills, HttpStatus.OK);
    }
//
}
