package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.EntityThuocTinh.Color;
import com.example.bee_shirt.repository.ColorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/colors")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này


public class ColorController {

    @Autowired
    private ColorRepository colorRepository;

    // Hiển thị danh sách Color với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<List<Color>> getAllBrands() {
        List<Color> categories = colorRepository.findAll(); // Lấy tất cả các danh mục
        return ResponseEntity.ok(categories);
    }

    // Thêm Color
    @PostMapping("/add")
    public ResponseEntity<Color> addColor(@RequestBody Color color) {
        color.setStatusColor(1);
        Color savedColor = colorRepository.save(color);
        return ResponseEntity.ok(savedColor);
    }

    // Sửa Color theo mã
    @PutMapping("/update/{id}")
    public ResponseEntity<Color> updateColor(@PathVariable Integer id, @RequestBody Color updatedDetails) {
        // Tìm kiếm màu theo id
        Color color = colorRepository.findById(id).orElse(null);

        // Kiểm tra nếu không tìm thấy màu với id đó
        if (color == null) {
            return ResponseEntity.notFound().build(); // Trả về mã lỗi 404 nếu không tìm thấy
        }

        // Cập nhật các thuộc tính của màu
        color.setCodeColor(updatedDetails.getCodeColor());
        color.setNameColor(updatedDetails.getNameColor());
        color.setStatusColor(updatedDetails.getStatusColor());

        // Lưu màu đã cập nhật vào cơ sở dữ liệu
        Color updatedColor = colorRepository.save(color);

        // Trả về màu đã cập nhật
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
    @GetMapping("/detail/{id}")
    public ResponseEntity<Color> getColorDetail(@PathVariable Integer id) {
        Color color = colorRepository.findById(id).orElse(null);
        return ResponseEntity.ok(color);
    }

}
