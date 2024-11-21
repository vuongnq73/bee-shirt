package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Color;
import com.example.bee_shirt.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping("/api/colors")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này


public class ColorController {

    @Autowired
    private ColorRepository colorRepository;

    // Hiển thị danh sách Color với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<Page<Color>> getColors(@RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        Page<Color> colors = colorRepository.findAllByColor(pageable);
        return ResponseEntity.ok(colors);
    }

    // Thêm Color
    @PostMapping("/add")
    public ResponseEntity<Color> addColor(@RequestBody Color color) {
        String codeCategory = generateCategoryCode();

        // Cập nhật mã codeCategory vào đối tượng Category
         color.setCodeColor(codeCategory);

        // Lưu category vào cơ sở dữ liệu
        Color savedColor = colorRepository.save(color);
        return ResponseEntity.ok(savedColor);
    }

    // Sửa Color theo mã
    @PutMapping("/update/{codeColor}")
    public ResponseEntity<Color> updateColor(@PathVariable String codeColor, @RequestBody Color updatedDetails) {
        Color color = colorRepository.findByCodeColor(codeColor);

        if (color == null) {
            return ResponseEntity.notFound().build();
        }

        color.setCodeColor(updatedDetails.getCodeColor());
        color.setNameColor(updatedDetails.getNameColor());
        color.setStatusColor(updatedDetails.getStatusColor());
        Color updatedColor = colorRepository.save(color);
        return ResponseEntity.ok(updatedColor);
    }

    // Xóa mềm Color
    @PutMapping("/delete/{codeColor}")
    public ResponseEntity<Color> deleteColor(@PathVariable String codeColor) {
        Color color = colorRepository.findByCodeColor(codeColor);

        if (color == null) {
            return ResponseEntity.notFound().build();
        }

        color.setDeleted(true);
        Color updatedColor = colorRepository.save(color);
        return ResponseEntity.ok(updatedColor);
    }

    // Lấy chi tiết Color theo mã
    @GetMapping("/detail/{codeColor}")
    public ResponseEntity<Color> getColorDetail(@PathVariable String codeColor) {
        Color color = colorRepository.findByCodeColor(codeColor);
        return ResponseEntity.ok(color);
    }
    // Hàm tạo mã category ngẫu nhiên
    private String generateCategoryCode() {
        Random random = new Random();
        int randomCode = random.nextInt(10000);  // Sinh ra số ngẫu nhiên trong phạm vi 0 - 99999
        return "CO" + String.format("%04d", randomCode);  // Đảm bảo mã luôn có 4 chữ số
    }
}
