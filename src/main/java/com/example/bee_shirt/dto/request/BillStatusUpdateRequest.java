package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BillStatusUpdateRequest {
    private String codeBill; // Mã hóa đơn
    private int statusBill;  // Trạng thái hóa đơn
      private String note;

}
