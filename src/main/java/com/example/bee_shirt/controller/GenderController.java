package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Color;
import com.example.bee_shirt.EntityThuocTinh.Gender;
import com.example.bee_shirt.repository.GenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/genders")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này

public class GenderController {

    @Autowired
    private GenderRepository genderRepository;

    // Hiển thị danh sách Gender với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<List<Gender>> getAllBrands() {

        List<Gender> categories = genderRepository.findAll(); // Lấy tất cả các danh mục
        return ResponseEntity.ok(categories);
    }


    // Thêm Gender
    @PostMapping("/add")
    public ResponseEntity<Gender> addGender(@RequestBody Gender gender) {
        String codeCategory = generateGenderCode();

        // Cập nhật mã codeCategory vào đối tượng Category
        gender.setCodeGender(codeCategory);

        Gender savedGender = genderRepository.save(gender);
        return ResponseEntity.ok(savedGender);
    }

    // Sửa Gender theo mã
    @PutMapping("/update/{codeGender}")
    public ResponseEntity<Gender> updateGender(@PathVariable String codeGender, @RequestBody Gender updatedDetails) {
        Gender gender = genderRepository.findByCodeGender(codeGender);

        if (gender == null) {
            return ResponseEntity.notFound().build();
        }

        gender.setCodeGender(updatedDetails.getCodeGender());
        gender.setNameGender(updatedDetails.getNameGender());
        gender.setStatusGender(updatedDetails.getStatusGender());
        Gender updatedGender = genderRepository.save(gender);
        return ResponseEntity.ok(updatedGender);
    }

    // Xóa mềm Gender
    @PutMapping("/delete/{codeGender}")
    public ResponseEntity<Gender> deleteGender(@PathVariable String codeGender) {
        Gender gender = genderRepository.findByCodeGender(codeGender);

        if (gender == null) {
            return ResponseEntity.notFound().build();
        }

        gender.setDeleted(true);
        Gender updatedGender = genderRepository.save(gender);
        return ResponseEntity.ok(updatedGender);
    }

    // Lấy chi tiết Gender theo mã
    @GetMapping("/detail/{codeGender}")
    public ResponseEntity<Gender> getGenderDetail(@PathVariable String codeGender) {
        Gender gender = genderRepository.findByCodeGender(codeGender);
        return ResponseEntity.ok(gender);
    }
    // Hàm tạo mã ngẫu nhiên cho Gender
    private String generateGenderCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "G" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }

}
