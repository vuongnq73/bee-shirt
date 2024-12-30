package com.example.bee_shirt.controller;

import com.example.bee_shirt.dto.AddToCartRequestDTO;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.service.CartDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cart")
public class CartDetailController {

    @Autowired
    private CartDetailService cartDetailService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add")
    public CartDetail addToCart(@RequestBody AddToCartRequestDTO addToCartRequestDTO) {
        return cartDetailService.addToCart(addToCartRequestDTO);
    }
}

