package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Material;
import com.example.bee_shirt.EntityThuocTinh.Season;
import com.example.bee_shirt.repository.SeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/seasons")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Cấu hình CORS cho endpoint này

public class SeasonController {

    @Autowired
    private SeasonRepository seasonRepository;


    // Hiển thị danh sách mùa với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<List<Season>> getAllBrands() {
        List<Season> categories = seasonRepository.findAll(); // Lấy tất cả các danh mục
        return ResponseEntity.ok(categories);
    }

    // Thêm mùa
    @PostMapping("/add")
    public ResponseEntity<Season> addSeason(@RequestBody Season season) {
        String codeCategory = generateSizeCode();

        // Cập nhật mã codeCategory vào đối tượng Category
        season.setCodeSeason(codeCategory);

        Season savedSeason = seasonRepository.save(season);
        return ResponseEntity.ok(savedSeason);
    }

    // Sửa mùa theo mã
    @PutMapping("/update/{codeSeason}")
    public ResponseEntity<Season> updateSeason(@PathVariable String codeSeason, @RequestBody Season updatedDetails) {
        Season season = seasonRepository.findByCodeSeason(codeSeason);

        if (season == null) {
            return ResponseEntity.notFound().build();
        }

        season.setCodeSeason(updatedDetails.getCodeSeason());
        season.setNameSeason(updatedDetails.getNameSeason());
        season.setStatusSeason(updatedDetails.getStatusSeason());
        Season updatedSeason = seasonRepository.save(season);
        return ResponseEntity.ok(updatedSeason);
    }

    // Xóa mềm mùa
    @PutMapping("/delete/{codeSeason}")
    public ResponseEntity<Season> deleteSeason(@PathVariable String codeSeason) {
        Season season = seasonRepository.findByCodeSeason(codeSeason);

        if (season == null) {
            return ResponseEntity.notFound().build();
        }

        season.setDeleted(true);
        Season updatedSeason = seasonRepository.save(season);
        return ResponseEntity.ok(updatedSeason);
    }

    // Lấy chi tiết mùa theo mã
    @GetMapping("/detail/{codeSeason}")
    public ResponseEntity<Season> getSeasonDetail(@PathVariable String codeSeason) {
        Season season = seasonRepository.findByCodeSeason(codeSeason);
        return ResponseEntity.ok(season);
    }
    // Hàm tạo mã ngẫu nhiên cho Size
    private String generateSizeCode() {
        Random random = new Random();
        int randomCode = random.nextInt(10000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "SE" + String.format("%04d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }

}
