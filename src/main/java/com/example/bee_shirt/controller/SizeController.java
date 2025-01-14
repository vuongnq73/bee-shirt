package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Material;
import com.example.bee_shirt.EntityThuocTinh.Size;
import com.example.bee_shirt.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/sizes")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này

public class SizeController {

    @Autowired
    private SizeRepository sizeRepository;

    // Hiển thị danh sách kích thước với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<List<Size>> getAllBrands() {
        List<Size> categories = sizeRepository.findAll(); // Lấy tất cả các danh mục
        return ResponseEntity.ok(categories);
    }

    // Thêm kích thước
    @PostMapping("/add")
    public ResponseEntity<Size> addSize(@RequestBody Size size) {
        String codeCategory = generateSizeCode();
        size.setStatussize(1);
        // Cập nhật mã codeCategory vào đối tượng Category
        size.setCodeSize(codeCategory);

        Size savedSize = sizeRepository.save(size);
        return ResponseEntity.ok(savedSize);
    }

    // Sửa kích thước theo mã
    @PutMapping("/update/{codeSize}")
    public ResponseEntity<Size> updateSize(@PathVariable String codeSize, @RequestBody Size updatedDetails) {
        Size size = sizeRepository.findByCodeSize(codeSize);

        if (size == null) {
            return ResponseEntity.notFound().build();
        }

        size.setCodeSize(updatedDetails.getCodeSize());
        size.setNamesize(updatedDetails.getNamesize());
        size.setStatussize(updatedDetails.getStatussize());
        size.setDeleted(updatedDetails.isDeleted());
        Size updatedSize = sizeRepository.save(size);
        return ResponseEntity.ok(updatedSize);
    }

    // Xóa mềm kích thước
    @PutMapping("/delete/{codeSize}")
    public ResponseEntity<Size> deleteSize(@PathVariable String codeSize) {
        Size size = sizeRepository.findByCodeSize(codeSize);

        if (size == null) {
            return ResponseEntity.notFound().build();
        }

        size.setDeleted(true);
        Size updatedSize = sizeRepository.save(size);
        return ResponseEntity.ok(updatedSize);
    }

    // Lấy chi tiết kích thước theo mã
    @GetMapping("/detail/{codeSize}")
    public ResponseEntity<Size> getSizeDetail(@PathVariable String codeSize) {
        Size size = sizeRepository.findByCodeSize(codeSize);
        return ResponseEntity.ok(size);
    }
    // Hàm tạo mã ngẫu nhiên cho Size
    private String generateSizeCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "S" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }

}
