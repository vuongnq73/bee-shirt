package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.EntityThuocTinh.Category;
import com.example.bee_shirt.dto.ShirtResponseDTO;
import com.example.bee_shirt.entity.Shirt;
import com.example.bee_shirt.repository.BrandRepository;
import com.example.bee_shirt.repository.CategoryRepository;
import com.example.bee_shirt.repository.ShirtRepository;
import com.example.bee_shirt.service.lmp.ShirtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/shirts")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ShirtController {

    @Autowired
    private ShirtService shirtService;

    @Autowired
    private ShirtRepository shirtRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/api/brands")
    public ResponseEntity<Iterable<Brand>> getAllBrands() {
        Iterable<Brand> brands = shirtService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/api/categories")
    public ResponseEntity<Iterable<Category>> getAllCategories() {
        Iterable<Category> categories = shirtService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/api/hienthi")
    public ResponseEntity<List<ShirtResponseDTO>> getShirts(Pageable pageable) {
        Page<ShirtResponseDTO> results = shirtService.getAllShirts(pageable);
        return ResponseEntity.ok(results.getContent());
    }
    @PostMapping("/add")
    public ResponseEntity<Shirt> addShirt(@RequestBody Shirt shirt) {
        // Kiểm tra trùng tên
        boolean existsByName = shirtRepository.existsByNameshirt(shirt.getNameshirt());
        if (existsByName) {
            throw new IllegalArgumentException("Tên áo thun đã tồn tại!");
        }

        // Kiểm tra mã áo thun, nếu trùng thì tạo mã mới
        if (shirt.getCodeshirt() == null || shirt.getCodeshirt().isEmpty()) {
            String generatedCode = "S" + generateRandomNumber(6);
            shirt.setCodeshirt(generatedCode);
        } else {
            boolean existsByCode = shirtRepository.existsByCodeshirt(shirt.getCodeshirt());
            if (existsByCode) {
                // Nếu mã trùng, tạo mã mới và trả lại cho frontend
                String generatedCode = "S" + generateRandomNumber(6);
                shirt.setCodeshirt(generatedCode);
            }
        }

        // Kiểm tra trùng thương hiệu
        Optional<Brand> brand = brandRepository.findById(shirt.getBrand().getId());
        if (brand.isEmpty()) {
            throw new IllegalArgumentException("Thương hiệu không tồn tại!");
        }

        // Kiểm tra trùng danh mục
        Optional<Category> category = categoryRepository.findById(shirt.getCategory().getId());
        if (category.isEmpty()) {
            throw new IllegalArgumentException("Danh mục không tồn tại!");
        }

        // Lưu vào cơ sở dữ liệu
        Shirt createdShirt = shirtService.addShirt(shirt);
        return ResponseEntity.ok(createdShirt);
    }



    @PutMapping("/update/{codeshirt}")
    public ResponseEntity<?> updateShirt(@PathVariable String codeshirt, @RequestBody Shirt updatedShirt) {
        // Lấy áo thun hiện tại dựa trên mã
        Shirt existingShirt = shirtService.getShirtByCode(codeshirt);

        if (existingShirt == null) {
            return ResponseEntity.notFound().build(); // Không tìm thấy áo thun
        }

        // Kiểm tra trùng tên
        boolean existsByName = shirtRepository.existsByNameshirt(updatedShirt.getNameshirt());

        // Nếu tên đã tồn tại và không phải là tên của sản phẩm hiện tại
        if (existsByName && !updatedShirt.getNameshirt().equalsIgnoreCase(existingShirt.getNameshirt())) {
            return ResponseEntity.badRequest().body("Tên áo thun đã tồn tại!");
        }

        // Cập nhật áo thun
        Shirt shirt = shirtService.updateShirt(codeshirt, updatedShirt);
        return ResponseEntity.ok(shirt);
    }



    @DeleteMapping("/delete/{codeshirt}")
    public ResponseEntity<Void> deleteShirt(@PathVariable String codeshirt) {
        Shirt shirt = shirtService.deleteShirt(codeshirt);
        if (shirt != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    private String generateRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));  // Lấy ngẫu nhiên một số từ 0 đến 9
        }

        return sb.toString();
    }
}
