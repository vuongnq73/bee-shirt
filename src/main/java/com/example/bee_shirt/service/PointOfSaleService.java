package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.repository.*;
import com.github.sarxos.webcam.Webcam;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PointOfSaleService {

    private final Webcam webcam = Webcam.getDefault();
    private Boolean webcamStat = false;

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

    public List<ShirtDetail> searchShirtDetails(String query, int page, int size) {
        return shirtDetailRepository.findListShirtDetailByCodeOrName("%" + query + "%", PageRequest.of(page, size)).getContent();
    }

    public List<Bill> getPendingBills() {
        List<BillDetail> oldBillDetails = billDetailRepository.findOldPendingBillDetails();
        for (BillDetail obd : oldBillDetails) {
            obd.getShirtDetail().setQuantity(obd.getShirtDetail().getQuantity() + obd.getQuantity());
            shirtDetailRepository.save(obd.getShirtDetail());
        }
        billRepository.cancelOldPendingBills();
        return billRepository.findPendingBill();
    }

    public List<ShirtDetail> getAllShirtDetail() {
        return shirtDetailRepository.findAllAvaiable();
    }

    public List<BillDetail> getBillDetails(String codeBill) {
        return billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0);
    }

    public Bill getBill(String codeBill) {
        return billRepository.findBillByCode(codeBill);
    }

    public ShirtDetail getShirtDetail(String codeShirtDetail) {
        return shirtDetailRepository.findShirtDetailByCode(codeShirtDetail);
    }

    public Voucher1 getVoucher(String getVoucher) {
        return voucherRepository.findVoucherByCode(getVoucher).orElse(null);
    }

    public Account getAccount(String username) {
        return accountRepository.findByUsername(username).orElse(null);
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

    public String createNewBill() {
        String randomCode = generateRandomCode();
        Bill bill = new Bill();
        bill.setCodeBill("CB" + randomCode);
        bill.setCustomer(accountRepository.findByUsername("khachvanglai").get());
        bill.setCreateAt(LocalDateTime.now());
        bill.setStatusBill(0);
        bill.setDeleted(false);
        billRepository.save(bill);
        return "Create blank bill successfully";
    }

    public String addItemToCart(String codeShirtDetail, String codeBill, Integer quantity) {
        String randomCode = generateRandomCode();
        ShirtDetail shirtDetail = shirtDetailRepository.findShirtDetailByCode(codeShirtDetail);
        Bill bill = billRepository.findBillByCode(codeBill);
        BillDetail existingBillDetail = billDetailRepository.findBillDetailByCodeBillAndCodeShirtDetailAndStatusBillDetail(codeBill, codeShirtDetail, 0);

        if (existingBillDetail != null) {
            existingBillDetail.setQuantity(quantity + existingBillDetail.getQuantity());
            billDetailRepository.save(existingBillDetail);
        } else {
            BillDetail billDetail = new BillDetail();
            billDetail.setQuantity(quantity);
            billDetail.setBill(bill);
            billDetail.setShirtDetail(shirtDetail);
            billDetail.setPrice(shirtDetail.getPrice());
            billDetail.setStatusBillDetail(0);
            billDetail.setCodeBillDetail("CBD" + randomCode);
            billDetailRepository.save(billDetail);
        }

//        shirtDetail.setQuantity(shirtDetail.getQuantity() - quantity);
//        shirtDetailRepository.save(shirtDetail);
        return "Add to cart successfully";
    }

    public String changeItemQuantity(String codeBillDetail, Integer quantity) {
        BillDetail billDetail = billDetailRepository.findBillDetailByCode(codeBillDetail);
        if (billDetail == null) {
            return "No bill detail found";
        }

        Integer oldQuantity = billDetail.getQuantity();
        billDetail.setQuantity(quantity);
        billDetailRepository.save(billDetail);

        billDetail.getShirtDetail().setQuantity(billDetail.getShirtDetail().getQuantity() + oldQuantity - quantity);
//        shirtDetailRepository.save(billDetail.getShirtDetail());
        return "Change quantity successfully";
    }

    public String removeItemFromCart(String codeBillDetail) {
        BillDetail billDetail = billDetailRepository.findBillDetailByCode(codeBillDetail);
        if (billDetail == null) {
            return "No bill detail found";
        }
        billDetail.setStatusBillDetail(2);
        billDetailRepository.save(billDetail);

//        billDetail.getShirtDetail().setQuantity(billDetail.getShirtDetail().getQuantity() + billDetail.getQuantity());
//        shirtDetailRepository.save(billDetail.getShirtDetail());
        return "Remove item from cart successfully";
    }

    public String cancelBill(String codeBill) {
        Bill bill = billRepository.findBillByCode(codeBill);
        bill.setStatusBill(10);
        billRepository.save(bill);

//        List<BillDetail> oldCart = billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0);
//        for (BillDetail oc : oldCart) {
//            oc.getShirtDetail().setQuantity(oc.getShirtDetail().getQuantity() + oc.getQuantity());
//            shirtDetailRepository.save(oc.getShirtDetail());
//        }
        return "Cancel successfully";
    }

    public int checkBillDetailBeforeCheckout(String codeBill) {
        int status = 0;
        List<BillDetail> oldCart = billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0);
        for (BillDetail oc : oldCart) {
            if (oc.getQuantity() > oc.getShirtDetail().getQuantity()) {
                oc.setQuantity(oc.getShirtDetail().getQuantity());
                status +=1;
            }
            if (oc.getShirtDetail().getQuantity() == 0){
                oc.setStatusBillDetail(2);
                status +=1;
            }
            billDetailRepository.save(oc);
        }
        return status;
    }

    public String updateCustomerInfo(String codeBill, String username) {
        Bill bill = billRepository.findBillByCode(codeBill);
        Account customer = accountRepository.findByUsername(username).orElse(null);
        bill.setCustomer(customer);
        billRepository.save(bill);
        return "Update customer info successfully";
    }

    public String checkout(String codeBill, String codeVoucher, String username, String userCode) {
        Bill bill = billRepository.findBillByCode(codeBill);
        Voucher1 voucher = voucherRepository.findVoucherByCode(codeVoucher).orElse(null);
        Account account = bill.getCustomer();
        bill.setAccount(accountRepository.findByCode(userCode).get());
        bill.setVoucher(voucher);
        bill.setCustomer(account);
        bill.setTypeBill("In-Store");
        bill.setCustomerName(account.getFirstName() + account.getLastName());
        bill.setPhoneNumber(account.getPhone());


        bill.setAddressCustomer("hanoi");

        bill.setMoneyShip(BigDecimal.ZERO);
        double subtotalBeforeDiscount = 0.0;
        double moneyReduce = 0.0;
        for (BillDetail bd : billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0)) {
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
        bill.setSubtotalBeforeDiscount(BigDecimal.valueOf(subtotalBeforeDiscount));
        bill.setMoneyReduce(BigDecimal.valueOf(moneyReduce));
        bill.setTotalMoney(BigDecimal.valueOf(subtotalBeforeDiscount - moneyReduce));
        bill.setCreateDate(LocalDate.now());
        bill.setDesiredDate(LocalDate.now());
        bill.setStatusBill(6);
        bill.setUpdateAt(LocalDate.now());
        bill.setNote("None");
        if (voucher != null) {
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }

        BillPayment bp = new BillPayment();
        bp.setBill(bill);
        bp.setPaymentAmount(bill.getTotalMoney());
        bp.setDeleted(false);

        bp.setPaymentMethod(paymentMethodRepository.findPaymentMethodByCode("PM001"));

        billPaymentRepository.save(bp);
        billRepository.save(bill);
        List<BillDetail> oldCart = billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0);
        for (BillDetail oc : oldCart) {
            oc.getShirtDetail().setQuantity(oc.getShirtDetail().getQuantity() - oc.getQuantity());
            shirtDetailRepository.save(oc.getShirtDetail());
        }
        return "Checkout successfully";
    }

    public String closeWebcam() {
        webcamStat = false;
        if (webcam.isOpen()) {
            webcam.close();
        }
        return "Webcam closed";
    }

    public String scanBarcode() {
        webcamStat = true;
        webcam.open();

        long startTime = System.currentTimeMillis(); // Lưu thời gian bắt đầu
        long timeout = 15000; // Thời gian chờ (15 giây)

        try {
            while (webcamStat) {
                BufferedImage image = webcam.getImage();
                if (image == null) continue;

                LuminanceSource source = new BufferedImageLuminanceSource(image);
                BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

                try {
                    Result result = new MultiFormatReader().decode(bitmap);
                    if (result.getText() != null) {
                        return result.getText();
                    }
                } catch (NotFoundException ignored) {
                }

                // Kiểm tra thời gian hiện tại so với thời gian bắt đầu
                if (System.currentTimeMillis() - startTime > timeout) {
                    webcamStat = false; // Kết thúc vòng lặp
                    return "Timeout";
                }

                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    return "Thread bị gián đoạn.";
                }
            }
        } finally {
            if (webcam.isOpen()) {
                webcam.close();
            }
        }

        return "Webcam end";
    }


    public List<Account> getAllCustomer() {
        return accountRepository.getAllCustomer();
    }

    public List<Voucher1> findAvailableVoucher(Integer money) {

        return voucherRepository.findAvailableVoucher(money, LocalDateTime.now());
    }
}

