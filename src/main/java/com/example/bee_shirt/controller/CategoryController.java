package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Category;
import com.example.bee_shirt.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này

public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // Hiển thị danh sách Category với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<Page<Category>> getCategories(@RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        Page<Category> categories = categoryRepository.findAllCategory(pageable);
        return ResponseEntity.ok(categories);
    }


    // Thêm Category
    @PostMapping("/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        String codeCategory = generateCategoryCode();
        category.setStatusCategory(1);
        // Cập nhật mã codeCategory vào đối tượng Category
        category.setCodeCategory(codeCategory);

        // Lưu category vào cơ sở dữ liệu
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    // Sửa Category theo mã
    @PutMapping("/update/{codeCategory}")
    public ResponseEntity<Category> updateCategory(@PathVariable String codeCategory, @RequestBody Category updatedDetails) {
        Category category = categoryRepository.findByCodeCategory(codeCategory);

        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        category.setCodeCategory(updatedDetails.getCodeCategory());
        category.setNameCategory(updatedDetails.getNameCategory());
        category.setStatusCategory(updatedDetails.getStatusCategory());
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    // Xóa mềm Category
    @PutMapping("/delete/{codeCategory}")
    public ResponseEntity<Category> deleteCategory(@PathVariable String codeCategory) {
        Category category = categoryRepository.findByCodeCategory(codeCategory);

        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        category.setDeleted(true);
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    // Lấy chi tiết Category theo mã
    @GetMapping("/detail/{codeCategory}")
    public ResponseEntity<Category> getCategoryDetail(@PathVariable String codeCategory) {
        Category category = categoryRepository.findByCodeCategory(codeCategory);
        return ResponseEntity.ok(category);
    }

    // Hàm tạo mã category ngẫu nhiên
    private String generateCategoryCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh ra số ngẫu nhiên trong phạm vi 0 - 99999
        return "C" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }
}
