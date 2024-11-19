package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.Material;
import com.example.bee_shirt.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialRepository materialRepository;

    // Hiển thị danh sách vật liệu với phân trang 5 phần tử
    @GetMapping("/list")
    public ResponseEntity<Page<Material>> getMaterials(@RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 5);
        Page<Material> materials = materialRepository.findAllMaterials(pageable);
        return ResponseEntity.ok(materials);
    }

    // Thêm vật liệu
    @PostMapping("/add")
    public ResponseEntity<Material> addMaterial(@RequestBody Material material) {
        Material savedMaterial = materialRepository.save(material);
        return ResponseEntity.ok(savedMaterial);
    }

    // Sửa vật liệu theo mã
    @PutMapping("/update/{codeMaterial}")
    public ResponseEntity<Material> updateMaterial(@PathVariable String codeMaterial, @RequestBody Material updatedDetails) {
        Material material = materialRepository.findByCodeMaterial(codeMaterial);

        if (material == null) {
            return ResponseEntity.notFound().build();
        }

        material.setCodeMaterial(updatedDetails.getCodeMaterial());
        material.setNameMaterial(updatedDetails.getNameMaterial());
        material.setStatusMaterial(updatedDetails.getStatusMaterial());
        Material updatedMaterial = materialRepository.save(material);
        return ResponseEntity.ok(updatedMaterial);
    }

    // Xóa mềm vật liệu
    @PutMapping("/delete/{codeMaterial}")
    public ResponseEntity<Material> deleteMaterial(@PathVariable String codeMaterial) {
        Material material = materialRepository.findByCodeMaterial(codeMaterial);

        if (material == null) {
            return ResponseEntity.notFound().build();
        }

        material.setDeleted(true);
        Material updatedMaterial = materialRepository.save(material);
        return ResponseEntity.ok(updatedMaterial);
    }

    // Lấy chi tiết vật liệu theo mã
    @GetMapping("/detail/{codeMaterial}")
    public ResponseEntity<Material> getMaterialDetail(@PathVariable String codeMaterial) {
        Material material = materialRepository.findByCodeMaterial(codeMaterial);
        return ResponseEntity.ok(material);
    }
}
