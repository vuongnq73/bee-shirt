package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Category;
import com.example.bee_shirt.EntityThuocTinh.Gender;
import com.example.bee_shirt.EntityThuocTinh.Material;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.dto.response.HomePageResponse;
import com.example.bee_shirt.service.lmp.ShirtDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/homepage")
@Slf4j
public class HomePageController {
    @Autowired
    private ShirtDetailService shirtDetailService;

    @GetMapping("/bestsaler")
    public ApiResponse<List<HomePageResponse>> getHomePage(){
        return ApiResponse.<List<HomePageResponse>>builder()
                .code(1000)
                .result(shirtDetailService.getTop5ShirtDetail())
                .build();
    }

    @GetMapping("/getallshirt")
    public ApiResponse<List<HomePageResponse>> getAllShirt(){
        return ApiResponse.<List<HomePageResponse>>builder()
                .code(1000)
                .result(shirtDetailService.getAllShirtDetail())
                .build();
    }

    @GetMapping("/category")
    public ApiResponse<Iterable<Category>> getGenders(){
        return ApiResponse.<Iterable<Category>>builder()
                .code(1000)
                .result(shirtDetailService.getAllCategorys())
                .build();
    }
}
