package com.example.bee_shirt.controller;

import com.example.bee_shirt.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class VNPController {

    @Autowired
    private VNPayService vnPayService;

    @PostMapping("/submitOrder")
    public ResponseEntity<String> submitOrder(@RequestParam("amount") int orderTotal,
                                              @RequestParam("orderInfo") String orderInfo,
                                              HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return ResponseEntity.ok(vnpayUrl); // Trả về URL trực tiếp
    }

    @GetMapping("/vnpay-payment")
    public ResponseEntity<Map<String, Object>> handlePaymentResponse(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);

        Map<String, Object> response = new HashMap<>();
        response.put("paymentStatus", paymentStatus == 1 ? "success" : "fail");
        response.put("orderId", request.getParameter("vnp_OrderInfo"));
        response.put("totalPrice", request.getParameter("vnp_Amount"));
        response.put("paymentTime", request.getParameter("vnp_PayDate"));
        response.put("transactionId", request.getParameter("vnp_TransactionNo"));

        return ResponseEntity.ok(response);
    }
}

