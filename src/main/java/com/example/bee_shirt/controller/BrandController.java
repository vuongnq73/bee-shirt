package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;

    @GetMapping("/list")
    public ResponseEntity<List<Brand>> getAllBrands() {
        List<Brand> categories = brandRepository.findAll(); // Lấy tất cả các danh mục
        return ResponseEntity.ok(categories);
    }

    // Thêm Brand
    @PostMapping("/add")
    public ResponseEntity<Brand> addBrand(@RequestBody Brand brand) {
        brand.setCodeBrand(generateOriginCode());
        Brand savedBrand = brandRepository.save(brand);
        return ResponseEntity.ok(savedBrand);
    }

    // Sửa Brand theo ID
    @PutMapping("/update/{codeBrand}")
    public ResponseEntity<Brand> updateBrand(@PathVariable String codeBrand, @RequestBody Brand updatedDetails) {
        Brand brand = brandRepository.findByCodeBrand(codeBrand);

        if (brand == null) {
            return ResponseEntity.notFound().build();
        }

        brand.setCodeBrand(updatedDetails.getCodeBrand());
        brand.setNameBrand(updatedDetails.getNameBrand());
        brand.setStatusBrand(updatedDetails.getStatusBrand());
        Brand updatedBrand = brandRepository.save(brand);
        return ResponseEntity.ok(updatedBrand);
    }
     //Xóa mềm brand
    @PutMapping("/delete/{codeBrand}")
    public ResponseEntity<Brand> deleteBrand(@PathVariable String codeBrand, @RequestBody Brand updatedDetails) {
        Brand brand = brandRepository.findByCodeBrand(codeBrand);

        if (brand == null) {
            return ResponseEntity.notFound().build();
        }

        brand.setDeleted(true);
        Brand updatedBrand = brandRepository.save(brand);
        return ResponseEntity.ok(updatedBrand);
    }
    @GetMapping("/detail/{codeBrand}")
    public ResponseEntity<Brand> getShirtDetail(@PathVariable String codeBrand) {
        Brand brand = brandRepository.findByCodeBrand(codeBrand);
        return ResponseEntity.ok(brand);
    }
    // Hàm tạo mã ngẫu nhiên cho Origin
    private String generateOriginCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "B" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }
}
