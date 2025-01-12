package com.example.bee_shirt.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final String UPLOAD_DIR = "D:\\1a_DATN_2024\\bee-shirt\\Bee-ShirtF\\assets\\img\\";

    @PostMapping("/add")
    public String addProduct(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "No file selected.";
        }

        try {
            String fileName = file.getOriginalFilename();

            // Kiểm tra nếu tên tệp có sẵn
            if (fileName == null) {
                return "Invalid file name.";
            }

            // Tạo đối tượng File để lưu ảnh vào thư mục
            File dest = new File(UPLOAD_DIR + fileName);

            // Kiểm tra và tạo thư mục nếu chưa tồn tại
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Chuyển tệp vào thư mục đã chỉ định
            file.transferTo(dest);

            return "File uploaded successfully: " + fileName;

        } catch (IOException e) {
            return "Failed to upload file: " + e.getMessage();
        }
    }
}
