package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyOderDTO {
    private String codeBill;
    private Date createDate;
    private Double totalMoney;
    private Integer statusBill;

}
