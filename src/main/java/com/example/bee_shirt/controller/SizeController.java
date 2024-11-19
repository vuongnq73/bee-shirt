package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Size;
import com.example.bee_shirt.repository.SizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sizes")
public class SizeController {

    @Autowired
    private SizeRepository sizeRepository;

    // Hiển thị danh sách kích thước với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<Page<Size>> getSizes(@RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        Page<Size> sizes = sizeRepository.findAllSizes(pageable);
        return ResponseEntity.ok(sizes);
    }

    // Thêm kích thước
    @PostMapping("/add")
    public ResponseEntity<Size> addSize(@RequestBody Size size) {
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
}
