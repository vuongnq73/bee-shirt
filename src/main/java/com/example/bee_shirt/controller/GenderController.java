package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Gender;
import com.example.bee_shirt.repository.GenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/genders")
public class GenderController {

    @Autowired
    private GenderRepository genderRepository;

    // Hiển thị danh sách Gender với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<Page<Gender>> getGenders(@RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        Page<Gender> genders = genderRepository.findAllGender(pageable);
        return ResponseEntity.ok(genders);
    }

    // Thêm Gender
    @PostMapping("/add")
    public ResponseEntity<Gender> addGender(@RequestBody Gender gender) {
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
}
