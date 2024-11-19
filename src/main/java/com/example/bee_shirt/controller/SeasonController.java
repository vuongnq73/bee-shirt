package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Season;
import com.example.bee_shirt.repository.SeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seasons")
public class SeasonController {

    @Autowired
    private SeasonRepository seasonRepository;

    // Hiển thị danh sách mùa với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<Page<Season>> getSeasons(@RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        Page<Season> seasons = seasonRepository.findAllSeasons(pageable);
        return ResponseEntity.ok(seasons);
    }

    // Thêm mùa
    @PostMapping("/add")
    public ResponseEntity<Season> addSeason(@RequestBody Season season) {
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
}
