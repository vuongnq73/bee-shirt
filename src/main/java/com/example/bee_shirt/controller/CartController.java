package com.example.bee_shirt.controller;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
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
import java.util.Map;

@Controller
@RequestMapping("cart")
@RequiredArgsConstructor
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/get-all-cart-details")
    @ResponseBody
    public List<CartDetail> getAllCartDetails(@RequestParam("codeAccount") String codeAccount) {
        return cartService.getAllCartDetails(codeAccount);
    }

    @GetMapping("/update-invalid-quantity")
    @ResponseBody
    public int updateInvalidQuantity(@RequestParam("codeAccount") String codeAccount) {
        return cartService.updateInvalidQuantity(codeAccount);
    }

    @PostMapping("/cancel-cart-detail")
    @ResponseBody
    public int cancelCartDetail(@RequestParam("codeCartDetail") String codeCartDetail) {
        return cartService.cancelCartDetail(codeCartDetail);
    }

    @GetMapping("/get-shirt-detail")
    @ResponseBody
    public ShirtDetail getShirtDetail(@RequestParam("codeShirtDetail") String codeShirtDetail) {
        return cartService.getShirtDetail(codeShirtDetail);
    }

    @GetMapping("/get-cart-detail")
    @ResponseBody
    public CartDetail getCartDetail(@RequestParam("codeCartDetail") String codeCartDetail) {
        return cartService.getCartDetail(codeCartDetail);
    }

    @PostMapping("/change-quantity-cart-detail")
    @ResponseBody
    public int changeQuantityCartDetail(@RequestParam("codeCartDetail") String codeCartDetail, @RequestParam("quantity") Integer quantity) {
        return cartService.changeQuantityCartDetail(codeCartDetail, quantity);
    }
    @PostMapping("/checkout")
    public ResponseEntity<?> handlePostRequest(@RequestBody Map<String, Object> requestBody, @RequestParam("accCode") String accCode, @RequestParam("ship") Integer ship, @RequestParam(value = "voucherCode", required = false) String voucherCode) {
        Map<String, Object> address = (Map<String, Object>) requestBody.get("address");
        String pm = (String) requestBody.get("pm");
        return cartService.processCheckout(requestBody, accCode, voucherCode, address, pm, ship);
    }
    @GetMapping("/getIDCart")
    public ResponseEntity<List<Integer>> getMyCartIds() {
        List<Integer> cartId = cartService.getCartIdsForCurrentAccount();
        return ResponseEntity.ok(cartId);
    }
}
