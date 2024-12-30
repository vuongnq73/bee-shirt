package com.example.bee_shirt.controller;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.service.CartService;
import com.example.bee_shirt.service.PointOfSaleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("cart")
@CrossOrigin(origins = "http://127.0.0.1:5501")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/get-cart-details")
    @ResponseBody
    public List<CartDetail> getCartDetails(@RequestParam("codeAccount") String codeAccount) {
        return cartService.getCartDetails(codeAccount);
    }
    @GetMapping("/getIDCart")
    public ResponseEntity<List<Integer>> getMyCartIds() {
        List<Integer> cartId = cartService.getCartIdsForCurrentAccount();
        return ResponseEntity.ok(cartId);
    }
}
