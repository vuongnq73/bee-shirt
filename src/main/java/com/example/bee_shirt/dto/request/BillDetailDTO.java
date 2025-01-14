package com.example.bee_shirt.dto.request;

import lombok.Data;

@Data
public class BillDetailDTO {
    private String nameImage;
    private String nameShirt;
    private String nameBrand;
    private String nameSize;
    private int quantity;
    private double price;
    private String nameVoucher;
    private double subtotalBeforeDiscount;
    private double totalMoney;
    private String customerName;       // Thêm trường này
    private String addressCustomer;    // Thêm trường này
    private String phoneNumber;
    private double moneyReduce;// Thêm trường này
    private String codeBill;
    private String nameColor;
 private  String codeShirtDetail;
    // Constructor
    public BillDetailDTO(String nameImage, String nameShirt, String nameBrand, String nameSize,
                         int quantity, double price, String nameVoucher,
                         double subtotalBeforeDiscount, double totalMoney,
                         String customerName, String addressCustomer, String phoneNumber,double moneyReduce,String codeBill, String nameColor, String codeShirtDetail) {
        this.nameImage = nameImage;
        this.nameShirt = nameShirt;
        this.nameBrand = nameBrand;
        this.nameSize = nameSize;
        this.quantity = quantity;
        this.price = price;
        this.nameVoucher = nameVoucher;
        this.subtotalBeforeDiscount = subtotalBeforeDiscount;
        this.totalMoney = totalMoney;
        this.customerName = customerName;          // Gán giá trị cho trường mới
        this.addressCustomer = addressCustomer;    // Gán giá trị cho trường mới
        this.phoneNumber = phoneNumber;            // Gán giá trị cho trường mới
        this.moneyReduce = moneyReduce;  // Gán giá trị mặc đ��nh cho trư��ng mới
        this.codeBill = codeBill;  // Gán giá trị cho trư��ng mới
        this.nameColor = nameColor;
        this.codeShirtDetail = codeShirtDetail;  // Gán giá trị cho trư��ng mới
    }
}
