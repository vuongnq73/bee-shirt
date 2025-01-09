package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.mapper.AccountMapper;
import com.example.bee_shirt.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class CartService {
    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private AccountMapper accountMapper;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ShirtDetailRepository shirtDetailRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private VoucherRepository1 voucherRepository;

    @Autowired
    private AccountRepository accountRepository;


    @Autowired
    private BillDetailRepository billDetailRepository;

    @Autowired
    private BillPaymentRepo billPaymentRepository;

    @Autowired
    private PaymentMethodRepo paymentMethodRepository;


    public List<CartDetail> getAllCartDetails(String codeAccount) {
        return cartDetailRepository.findCartDetailByAccountCodeAndStatusCartDetail(codeAccount, 0);
    }

    public int updateInvalidQuantity(String codeAccount) {
        return cartDetailRepository.updateInvalidQuantity(codeAccount);
    }

    public AccountResponse getMyInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return accountMapper.toUserResponse(account);
    }

    public List<Integer> getCartIdsForCurrentAccount() {
        Integer accountId = this.getMyInfo().getId();
        return cartRepository.findCartIdsByAccountId(accountId);
    }

    public int cancelCartDetail(String codeCartDetail) {
        return cartDetailRepository.cancelCartDetail(codeCartDetail);
    }

    public int changeQuantityCartDetail(String codeCartDetail, Integer quantity) {
        return cartDetailRepository.changeQuantityCartDetail(codeCartDetail, quantity);
    }

    public ShirtDetail getShirtDetail(String codeShirtDetail) {
        return shirtDetailRepository.findShirtDetailByCode(codeShirtDetail);
    }

    public CartDetail getCartDetail(String codeCartDetail) {
        return cartDetailRepository.findCartDetailByCode(codeCartDetail);
    }

    public static String generateRandomCode() {
        Random random = new Random();
        List<Character> characters = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            characters.add((char) ('0' + random.nextInt(10)));
        }
        for (int i = 0; i < 3; i++) {
            characters.add((char) ('A' + random.nextInt(26)));
        }
        Collections.shuffle(characters);
        StringBuilder randomCode = new StringBuilder();
        for (char ch : characters) {
            randomCode.append(ch);
        }
        return randomCode.toString();
    }

    public ResponseEntity<?> processCheckout(Map<String, Object> requestBody, String accCode, String voucherCode, Map<String, Object> address, String pm) {
        // Lấy danh sách từ request body
        Object listObject = requestBody.get("list");

        System.out.println(requestBody);
        System.out.println(accCode);
        System.out.println(voucherCode);

        // Kiểm tra danh sách có tồn tại và là một List hay không
        if (!(listObject instanceof List<?>)) {
            return ResponseEntity.badRequest().body("Invalid data. 'list' must be an array.");
        }

        String randomCodeBill = generateRandomCode();
        Bill bill = new Bill();
        bill.setCodeBill("CB" + randomCodeBill);
        bill.setCreateAt(LocalDateTime.now());
        bill.setStatusBill(0);
        bill.setDeleted(false);


        bill.setAccount(accountRepository.findByCode(accCode).orElse(null));

        billRepository.save(bill);


        List<?> list = (List<?>) listObject;
        list.forEach(item -> {
            cartDetailRepository.checkoutCartDetail(item.toString());

            CartDetail cd4Checkout = cartDetailRepository.findCartDetailByCode(item.toString());

            String randomCodeBillDetail = generateRandomCode();
            ShirtDetail shirtDetail = shirtDetailRepository.findShirtDetailByCode(cd4Checkout.getShirtDetail().getCodeShirtDetail());


            BillDetail billDetail = new BillDetail();
            billDetail.setQuantity(cd4Checkout.getQuantity());
            billDetail.setBill(bill);
            billDetail.setShirtDetail(shirtDetail);
            billDetail.setPrice(shirtDetail.getPrice());
            billDetail.setStatusBillDetail(0);
            billDetail.setCodeBillDetail("CBD" + randomCodeBillDetail);
            billDetailRepository.save(billDetail);

//            shirtDetail.setQuantity(shirtDetail.getQuantity() - cd4Checkout.getQuantity());
//            shirtDetailRepository.save(shirtDetail);
        });

        Bill bill2 = billRepository.findBillByCode(bill.getCodeBill());
        Voucher1 voucher = voucherRepository.findVoucherByCode(voucherCode).orElse(null);
        Account account = bill2.getAccount();
        bill2.setVoucher(voucher);
        bill2.setCustomer(account);
        bill2.setTypeBill("Online");
        bill2.setCustomerName(account.getFirstName() + account.getLastName());
        bill2.setPhoneNumber(account.getPhone());
        bill2.setAddressCustomer(account.getAddress());
        bill2.setMoneyShip(BigDecimal.valueOf(30000));
        double subtotalBeforeDiscount = 0.0;
        double moneyReduce = 0.0;
        for (BillDetail bd : billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(bill.getCodeBill(), 0)) {
            subtotalBeforeDiscount += bd.getQuantity() * bd.getShirtDetail().getPrice().doubleValue();
        }
        if (voucher != null) {
            if (Objects.equals(voucher.getType_voucher(), "Amount")) {
                if (!(voucher.getMin_bill_value() > subtotalBeforeDiscount)) {
                    moneyReduce = voucher.getDiscount_value();
                }
            } else {
                if (!(voucher.getMin_bill_value() > subtotalBeforeDiscount)) {
                    moneyReduce = voucher.getDiscount_value() * subtotalBeforeDiscount / 100;
                    if (moneyReduce > voucher.getMaximum_discount()) {
                        moneyReduce = voucher.getMaximum_discount();
                    }
                }
            }
        }
        bill2.setSubtotalBeforeDiscount(BigDecimal.valueOf(subtotalBeforeDiscount));
        bill2.setMoneyReduce(BigDecimal.valueOf(moneyReduce));
        bill2.setTotalMoney(BigDecimal.valueOf(subtotalBeforeDiscount - moneyReduce));
        bill2.setCreateDate(LocalDate.now());
        bill2.setDesiredDate(LocalDate.now());
        bill2.setStatusBill(1);
        bill2.setUpdateAt(LocalDate.now());
        bill2.setNote("None");
        if (voucher != null) {
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }
        if (address != null) {
            bill2.setCustomerName((String) address.get("name"));
            bill2.setPhoneNumber((String) address.get("phone"));
            bill2.setAddressCustomer((String) address.get("fullAddress"));
        }

        BillPayment bp = new BillPayment();
        bp.setBill(bill2);
        bp.setPaymentAmount(bill2.getTotalMoney());
        bp.setDeleted(false);

        System.out.println(pm);
        if (Objects.equals(pm, "cash")) {
            bp.setPaymentMethod(paymentMethodRepository.findPaymentMethodByCode("PM001"));
        } else {
            bp.setPaymentMethod(paymentMethodRepository.findPaymentMethodByCode("PM002"));
        }
        billPaymentRepository.save(bp);

        System.out.println(bill2);
        billRepository.save(bill2);
        System.out.println("Received list: " + list);

        // Trả về phản hồi
        return ResponseEntity.ok(Map.of(
                "message", "List received successfully!",
                "receivedList", list
        ));
    }
}
