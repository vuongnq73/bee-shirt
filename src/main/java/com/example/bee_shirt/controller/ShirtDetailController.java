package com.example.bee_shirt.controller;

import com.example.bee_shirt.EntityThuocTinh.*;
import com.example.bee_shirt.dto.OnlineColorDTO;
import com.example.bee_shirt.dto.OnlineShirtDTO;
import com.example.bee_shirt.dto.OnlineShirtWithColorsDTO;
import com.example.bee_shirt.dto.ShirtDetailDTO;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.dto.response.ApiResponse;
import com.example.bee_shirt.dto.response.HomePageResponse;
import com.example.bee_shirt.entity.Shirt;
import com.example.bee_shirt.entity.ShirtDetail;
import com.example.bee_shirt.service.lmp.ShirtDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shirt-details")


@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ShirtDetailController {

    @Autowired
    private ShirtDetailService shirtDetailService;

    @GetMapping("/api/colors")
    public ResponseEntity<Iterable<Color>> getAllColors() {
        Iterable<Color> colors = shirtDetailService.getAllColors();
        return ResponseEntity.ok(colors);
    }

    @GetMapping("/api/genders")
    public ResponseEntity<Iterable<Gender>> getAllGenders() {
        Iterable<Gender> genders = shirtDetailService.getAllGenders();
        return ResponseEntity.ok(genders);
    }

    @GetMapping("/api/patterns")
    public ResponseEntity<Iterable<Pattern>> getAllPatterns() {
        Iterable<Pattern> patterns = shirtDetailService.getAllPatterns();
        return ResponseEntity.ok(patterns);
    }

    @GetMapping("/api/sizes")
    public ResponseEntity<Iterable<Size>> getAllSizes() {
        Iterable<Size> sizes = shirtDetailService.getAllSizes();
        return ResponseEntity.ok(sizes);
    }

    @GetMapping("/api/materials")
    public ResponseEntity<Iterable<Material>> getAllMaterials() {
        Iterable<Material> materials = shirtDetailService.getAllMaterials();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/api/seasons")
    public ResponseEntity<Iterable<Season>> getAllSeasons() {
        Iterable<Season> seasons = shirtDetailService.getAllSeasons();
        return ResponseEntity.ok(seasons);
    }
    @GetMapping("/api/origins")
    public ResponseEntity<Iterable<Origin>> getAllOrigins() {
        Iterable<Origin> origins = shirtDetailService.getAllOrigins();
        return ResponseEntity.ok(origins);
    }
    @GetMapping("/api/shirts")
    public ResponseEntity<Iterable<Shirt>> getAllShirts() {
        Iterable<Shirt> shirts = shirtDetailService.getAllShirts();
        return ResponseEntity.ok(shirts);
    }

    @GetMapping("/api/shirt/byCode/{codeShirt}")
    public ResponseEntity<Shirt> getShirtByCodeShirt(@PathVariable String codeShirt) {
        Shirt shirt = shirtDetailService.getShirtByCodeShirt(codeShirt);
        return shirt != null ? ResponseEntity.ok(shirt) : ResponseEntity.notFound().build();
    }

    // Hiển thị danh sách chi tiết áo thun
    @GetMapping("/api/hienthi")
    public ResponseEntity<List<ShirtDetailDTO>> getShirtDetails(Pageable pageable) {
        List<ShirtDetailDTO> results = shirtDetailService.getAllShirtDetails(pageable);
        return ResponseEntity.ok(results);
    }
    // Hiển thị danh sách onl(ảnh,tên,giá)
    @GetMapping("/online/hienthi")
    public ResponseEntity<List<OnlineShirtWithColorsDTO>> getShirtsWithColors() {
        List<OnlineShirtWithColorsDTO> shirtsWithColors = shirtDetailService.getShirtsWithColors();
        return ResponseEntity.ok(shirtsWithColors);
    }


    // Thêm chi tiết áo thun
    @PostMapping("/add")
    public ResponseEntity<List<ShirtDetail>> addShirtDetails(@RequestBody List<ShirtDetailDTO> shirtDetailDTOs) {
        // In ra thông tin các ShirtDetailDTO nhận được
        shirtDetailDTOs.forEach(dto -> System.out.println("Received ShirtDetailDTO: " + dto));

        // Gọi service để chuyển đổi DTO thành entity và lưu vào database
        List<ShirtDetail> createdShirtDetails = shirtDetailService.addShirtDetails(shirtDetailDTOs);

        // Trả về danh sách các ShirtDetail đã được lưu
        return ResponseEntity.ok(createdShirtDetails);
    }

    // Cập nhật chi tiết áo thun
    @PutMapping("/update/{codeShirtDetail}")
    public ResponseEntity<ShirtDetail> updateShirtDetail(@PathVariable String codeShirtDetail, @RequestBody ShirtDetail updatedShirtDetail) {
        ShirtDetail shirtDetail = shirtDetailService.updateShirtDetail(codeShirtDetail, updatedShirtDetail);
        if (shirtDetail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(shirtDetail);
    }
    @GetMapping("/detail/{codeShirtDetail}")
    public ResponseEntity<ShirtDetailDTO> getShirtDetail(@PathVariable String codeShirtDetail) {
        ShirtDetailDTO shirtDetail = shirtDetailService.getShirtDetail(codeShirtDetail);
        if (shirtDetail != null) {
            return ResponseEntity.ok(shirtDetail);
        } else {
            // Trả về 404 nếu không tìm thấy
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping("/byCode/{codeshirt}")
    public ResponseEntity<List<ShirtDetailDTO>> getShirtDetailsByCodeShirt(@PathVariable String codeshirt) {
        List<ShirtDetailDTO> shirtDetails = shirtDetailService.getShirtDetailsByCodeShirt(codeshirt);
        return ResponseEntity.ok(shirtDetails);
    }

    // Xóa chi tiết áo thun
    @DeleteMapping("/delete/{codeShirtDetail}")
    public ResponseEntity<Void> deleteShirtDetail(@PathVariable String codeShirtDetail) {
        ShirtDetail shirtDetail = shirtDetailService.deleteShirtDetail(codeShirtDetail);
        if (shirtDetail!=null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Đường dẫn lưu tệp
            String uploadDir = "D:\\1a_DATN_2024\\bee-shirt\\Bee-ShirtF\\assets\\img";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs(); // Tạo thư mục nếu chưa tồn tại
            }

            // Lưu tệp
            String filePath = uploadDir + File.separator + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            // Trả về đường dẫn tệp
            return ResponseEntity.ok(Map.of("filePath", "/assets/img/" + file.getOriginalFilename()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lưu tệp");
        }
    }

}
