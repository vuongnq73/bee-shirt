package com.example.bee_shirt.controller;

import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.service.PointOfSaleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("point-of-sale")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PointOfSaleController {

    @Autowired
    private PointOfSaleService pointOfSaleService;

    @GetMapping("")
    public String pos(Model model) {
        model.addAttribute("products", pointOfSaleService.searchShirtDetails("", 0, 5)); // Thêm page = 0 và size = 5
        model.addAttribute("listhdc", pointOfSaleService.getPendingBills());
        return "haha";
    }


    @GetMapping("/search")
    @ResponseBody
    public List<ShirtDetail> search(@RequestParam("query") String query,
                                    @RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "5") int size) {
        return pointOfSaleService.searchShirtDetails(query, page, size);
    }

    @GetMapping("/get-all-shirt-detail")
    @ResponseBody
    public List<ShirtDetail> getAllShirtDetail() {
        return pointOfSaleService.getAllShirtDetail();
    }

    @GetMapping("/get-pending-bill")
    @ResponseBody
    public List<Bill> getPendingBill() {
        return pointOfSaleService.getPendingBills();
    }

    @GetMapping("/get-bill-detail")
    @ResponseBody
    public List<BillDetail> getBillDetail(@RequestParam("codeBill") String codeBill) {
        return pointOfSaleService.getBillDetails(codeBill);
    }

    @GetMapping("/check-bill-detail-before-checkout")
    @ResponseBody
    public int checkBillDetailBeforeCheckout(@RequestParam("codeBill") String codeBill) {
        return pointOfSaleService.checkBillDetailBeforeCheckout(codeBill);
    }

    @GetMapping("/get-bill")
    @ResponseBody
    public Bill getBill(@RequestParam("codeBill") String codeBill) {
        return pointOfSaleService.getBill(codeBill);
    }

    @GetMapping("/get-shirt-detail")
    @ResponseBody
    public ShirtDetail getShirtDetail(@RequestParam("codeShirtDetail") String codeShirtDetail) {
        return pointOfSaleService.getShirtDetail(codeShirtDetail);
    }


    @GetMapping("/get-shirt-detail-for-scan")
    @ResponseBody
    public ShirtDetail getShirtDetail4Scan(@RequestParam("codeShirtDetail") String codeShirtDetail) {
        return pointOfSaleService.getShirtDetail4Scan(codeShirtDetail);
    }

    @GetMapping("/get-voucher")
    @ResponseBody
    public Voucher1 getVoucher(@RequestParam("codeVoucher") String codeVoucher) {
        return pointOfSaleService.getVoucher(codeVoucher);
    }

    @GetMapping("/get-account")
    @ResponseBody
    public Account getAccount(@RequestParam("username") String username) {

        return pointOfSaleService.getAccount(username);
    }

    @GetMapping("/get-all-customer")
    @ResponseBody
    public List<Account> getAllCustomer() {
        return pointOfSaleService.getAllCustomer();
    }

    @GetMapping("/find-avaiable-voucher")
    @ResponseBody
    public List<Voucher1> findAvailableVoucher(@RequestParam("money") Integer money) {
        return pointOfSaleService.findAvailableVoucher(money);
    }


    @GetMapping("create-blank-bill")
    @ResponseBody
    public ResponseEntity<String> createNewBill() {
        return ResponseEntity.ok(pointOfSaleService.createNewBill());
    }

    @PostMapping("/quick-add")
    public ResponseEntity<Map<String, Object>> quickAdd(
            @RequestParam("activeBillCode") String activeBillCode,
            @RequestBody Map<String, Object> request) {

        List<Map<String, Object>> selectedData = (List<Map<String, Object>>) request.get("selectedData");

        for (Map<String, Object> item : selectedData) {
            String codeShirtDetail = (String) item.get("codeShirtDetail");
            int quantity = Integer.parseInt((String) item.get("quantity"));

            // Gọi hàm addItemToCart của service
            pointOfSaleService.addItemToCart(codeShirtDetail, activeBillCode, quantity);
        }

        // Trả về phản hồi dưới dạng JSON
        Map<String, Object> response = Map.of("message", "Dữ liệu đã được nhận và sản phẩm đã được thêm vào giỏ hàng.");
        return ResponseEntity.ok(response);    }

    @PostMapping("add-to-cart")
    @ResponseBody
    public ResponseEntity<String> addItemToCart(@RequestParam String codeShirtDetail, @RequestParam String codeBill, @RequestParam Integer quantity) {
        return ResponseEntity.ok(pointOfSaleService.addItemToCart(codeShirtDetail, codeBill, quantity));
    }



    @PostMapping("change-quantity")
    @ResponseBody
    public ResponseEntity<String> changeItemValue(@RequestParam String codeBillDetail, @RequestParam Integer quantity) {
        return ResponseEntity.ok(pointOfSaleService.changeItemQuantity(codeBillDetail, quantity));
    }

    @PostMapping("remove-item-from-cart")
    @ResponseBody
    public ResponseEntity<String> removeItemFromCart(@RequestParam String codeBillDetail) {
        return ResponseEntity.ok(pointOfSaleService.removeItemFromCart(codeBillDetail));
    }

    @PostMapping("cancel")
    public ResponseEntity<String> cancel(@RequestParam String codeBill) {
        return ResponseEntity.ok(pointOfSaleService.cancelBill(codeBill));
    }

    @PostMapping("update-customer-info")
    public ResponseEntity<String> updateCustomerInfo(@RequestParam String codeBill, @RequestParam String username) {

        return ResponseEntity.ok(pointOfSaleService.updateCustomerInfo(codeBill, username));
    }

    @PostMapping("checkout")
    public ResponseEntity<String> checkout(@RequestParam String codeBill, @RequestParam(required = false) String codeVoucher, @RequestParam(required = false) String username, @RequestParam(required = false) String userCode) {
        return ResponseEntity.ok(pointOfSaleService.checkout(codeBill, codeVoucher, username, userCode));
    }

    @GetMapping("/close")
    public ResponseEntity<String> close() {
        return ResponseEntity.ok(pointOfSaleService.closeWebcam());
    }

    @GetMapping("/scanBarcode")
    public ResponseEntity<String> scanBarcode() {
        return ResponseEntity.ok(pointOfSaleService.scanBarcode());
    }
}
