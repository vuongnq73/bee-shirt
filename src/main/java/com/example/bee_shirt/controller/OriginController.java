package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Material;
import com.example.bee_shirt.EntityThuocTinh.Origin;
import com.example.bee_shirt.repository.OriginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/origins")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này

public class OriginController {

    @Autowired
    private OriginRepository originRepository;

    // Hiển thị danh sách nguồn gốc với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<List<Origin>> getAllBrands() {
        List<Origin> categories = originRepository.findAll(); // Lấy tất cả các danh mục
        return ResponseEntity.ok(categories);
    }


    // Thêm nguồn gốc
    @PostMapping("/add")
    public ResponseEntity<Origin> addOrigin(@RequestBody Origin origin) {
        String codeCategory = generateOriginCode();

        // Cập nhật mã codeCategory vào đối tượng Category
        origin.setCodeOrigin(codeCategory);

        Origin savedOrigin = originRepository.save(origin);
        return ResponseEntity.ok(savedOrigin);
    }

    // Sửa nguồn gốc theo mã
    @PutMapping("/update/{codeOrigin}")
    public ResponseEntity<Origin> updateOrigin(@PathVariable String codeOrigin, @RequestBody Origin updatedDetails) {
        Origin origin = originRepository.findByCodeOrigin(codeOrigin);

        if (origin == null) {
            return ResponseEntity.notFound().build();
        }

        origin.setCodeOrigin(updatedDetails.getCodeOrigin());
        origin.setNameOrigin(updatedDetails.getNameOrigin());
        origin.setStatusOrigin(updatedDetails.getStatusOrigin());
        Origin updatedOrigin = originRepository.save(origin);
        return ResponseEntity.ok(updatedOrigin);
    }

    // Xóa mềm nguồn gốc
    @PutMapping("/delete/{codeOrigin}")
    public ResponseEntity<Origin> deleteOrigin(@PathVariable String codeOrigin) {
        Origin origin = originRepository.findByCodeOrigin(codeOrigin);

        if (origin == null) {
            return ResponseEntity.notFound().build();
        }

        origin.setDeleted(true);
        Origin updatedOrigin = originRepository.save(origin);
        return ResponseEntity.ok(updatedOrigin);
    }

    // Lấy chi tiết nguồn gốc theo mã
    @GetMapping("/detail/{codeOrigin}")
    public ResponseEntity<Origin> getOriginDetail(@PathVariable String codeOrigin) {
        Origin origin = originRepository.findByCodeOrigin(codeOrigin);
        return ResponseEntity.ok(origin);
    }
    // Hàm tạo mã ngẫu nhiên cho Origin
    private String generateOriginCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "O" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }

}
