package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.*;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.dto.response.HomePageResponse;
import com.example.bee_shirt.service.lmp.ShirtDetailService;
import com.example.bee_shirt.service.lmp.ShirtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/homepage")
@Slf4j
public class HomePageController {
    @Autowired
    private ShirtDetailService shirtDetailService;

    @Autowired
    private ShirtService shirtService;

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

    @GetMapping("/filler")
    public ApiResponse<List<HomePageResponse>> getAllShirtByPrice( @RequestParam(required = false) BigDecimal min,
                                                                   @RequestParam(required = false) BigDecimal max,
                                                                   @RequestParam(required = false) String color,
                                                                   @RequestParam(required = false) String brand,
                                                                   @RequestParam(required = false) String size,
                                                                   @RequestParam(required = false) Integer category,
                                                                   @RequestParam(required = false) int offset,
                                                                   @RequestParam(required = false) int limit){

        return ApiResponse.<List<HomePageResponse>>builder()
                .code(1000)
                .result(shirtDetailService.getAllShirtDetailByFiller(min,max,color,brand,size,category,offset,limit))
                .build();
    }

    @GetMapping("/countall")
    public ApiResponse<Integer> getAllShirtByColor(@RequestParam(required = false) BigDecimal min,
                                                   @RequestParam(required = false) BigDecimal max,
                                                   @RequestParam(required = false) String color,
                                                   @RequestParam(required = false) String brand,
                                                   @RequestParam(required = false) String size,
                                                   @RequestParam(required = false) Integer category){
        return ApiResponse.<Integer>builder()
                .code(1000)
                .result(shirtDetailService.countAll(min,max,color,brand,size,category))
                .build();
    }


    @GetMapping("/getbycolor/{code}")
    public ApiResponse<List<HomePageResponse>> getAllShirtByColor(@PathVariable("code") String code){
        return ApiResponse.<List<HomePageResponse>>builder()
                .code(1000)
                .result(shirtDetailService.getAllShirtDetailByColor(code))
                .build();
    }

    @GetMapping("/getcolors")
    public ApiResponse<Iterable<Color>> getAllShirtByPrice(){
        return ApiResponse.<Iterable<Color>>builder()
                .code(1000)
                .result(shirtDetailService.getAllColors())
                .build();
    }


    @GetMapping("/getbranchs")
    public ApiResponse<Iterable<Brand>> getAllBranch(){
        return ApiResponse.<Iterable<Brand>>builder()
                .code(1000)
                .result(shirtService.getAllBrands())
                .build();
    }

    @GetMapping("/getsizes")
    public ApiResponse<Iterable<Size>> getAllSize(){
        return ApiResponse.<Iterable<Size>>builder()
                .code(1000)
                .result(shirtDetailService.getAllSizes())
                .build();
    }

    @GetMapping("/category")
    public ApiResponse<Iterable<Category>> getGenders(){
        return ApiResponse.<Iterable<Category>>builder()
                .code(1000)
                .result(shirtDetailService.getAllCategories())
                .build();
    }

    @GetMapping("/getallshirt/{code}")
    public ApiResponse<List<HomePageResponse>> getShirtByCategoryCode(@PathVariable("code") String code){
        return ApiResponse.<List<HomePageResponse>>builder()
                .code(1000)
                .result(shirtDetailService.getAllShirtDetailByCategoryCode(code))
                .build();
    }


}
