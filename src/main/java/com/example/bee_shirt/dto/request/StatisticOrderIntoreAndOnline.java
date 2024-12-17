package com.example.bee_shirt.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StatisticOrderIntoreAndOnline {
    private double totalOrderInStore;
    private double totalOrderOnline;

}
