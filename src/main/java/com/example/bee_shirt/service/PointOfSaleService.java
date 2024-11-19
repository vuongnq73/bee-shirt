package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.repository.*;
import com.github.sarxos.webcam.Webcam;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    private VoucherRepository voucherRepository;

    @Autowired
    private BillDetailRepository billDetailRepository;

    public List<ShirtDetail> searchShirtDetails(String query, int page, int size) {
        return shirtDetailRepository.findListShirtDetailByCodeOrName("%" + query + "%", PageRequest.of(page, size)).getContent();
    }

    public List<Bill> getPendingBills() {
        return billRepository.findPendingBill();
    }

    public List<BillDetail> getBillDetails(String codeBill) {
        return billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0);
    }

    public ShirtDetail getShirtDetail(String codeShirtDetail) {
        return shirtDetailRepository.findShirtDetailByCode(codeShirtDetail);
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
        bill.setCreateAt(LocalDate.now());
        bill.setStatusBill(0);
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
        return "Add to cart successfully";
    }

    public String changeItemQuantity(String codeBillDetail, Integer quantity) {
        BillDetail billDetail = billDetailRepository.findBillDetailByCode(codeBillDetail);
        if (billDetail == null) {
            return "No bill detail found";
        }
        billDetail.setQuantity(quantity);
        billDetailRepository.save(billDetail);
        return "Change quantity successfully";
    }

    public String removeItemFromCart(String codeBillDetail) {
        BillDetail billDetail = billDetailRepository.findBillDetailByCode(codeBillDetail);
        if (billDetail == null) {
            return "No bill detail found";
        }
        billDetail.setStatusBillDetail(2);
        billDetailRepository.save(billDetail);
        return "Remove item from cart successfully";
    }

    public String cancelBill(String codeBill) {
        Bill bill = billRepository.findBillByCode(codeBill);
        bill.setStatusBill(2);
        billRepository.save(bill);
        return "Cancel successfully";
    }

    public String checkout(String codeBill, String codeVoucher) {
        Bill bill = billRepository.findBillByCode(codeBill);
        bill.setVoucher(voucherRepository.findVoucherByCode(codeVoucher));
        bill.setTypeBill("POS");
        bill.setCustomerName("1");
        bill.setPhoneNumber("1");
        bill.setAddressCustomer("1");
        bill.setMoneyShip(BigDecimal.ZERO);
        double subtotalBeforeDiscount = 0.0;
        double moneyReduce = 0.0;
        for (BillDetail bd : billDetailRepository.findBillDetailByBillCodeAndStatusBillDetail(codeBill, 0)) {
            subtotalBeforeDiscount += bd.getQuantity() * bd.getShirtDetail().getPrice().doubleValue();
        }
        bill.setSubtotalBeforeDiscount(BigDecimal.valueOf(subtotalBeforeDiscount));
        bill.setMoneyReduce(BigDecimal.valueOf(moneyReduce));
        bill.setTotalMoney(BigDecimal.valueOf(subtotalBeforeDiscount - moneyReduce));
        bill.setCreateDate(LocalDate.now());
        bill.setDesiredDate(LocalDate.now());
        bill.setStatusBill(1);
        bill.setUpdateAt(LocalDate.now());
        bill.setNote("None");
        billRepository.save(bill);
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
                } catch (NotFoundException ignored) {}

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
}
