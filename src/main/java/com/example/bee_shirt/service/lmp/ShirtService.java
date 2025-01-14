package com.example.bee_shirt.service.lmp;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.EntityThuocTinh.Category;
import com.example.bee_shirt.dto.ShirtResponseDTO;
import com.example.bee_shirt.entity.Shirt;
import com.example.bee_shirt.repository.BrandRepository;
import com.example.bee_shirt.repository.CategoryRepository;
import com.example.bee_shirt.repository.ShirtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class ShirtService {

    @Autowired
    private ShirtRepository shirtRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<ShirtResponseDTO> getAllShirts(Pageable pageable) {
        return shirtRepository.findAllShirt(pageable);
    }


    public Shirt addShirt(Shirt shirt) {
        // Kiểm tra tên áo thun đã tồn tại
        boolean exists = shirtRepository.existsByNameshirt(shirt.getNameshirt());
        if (exists) {
            throw new IllegalArgumentException("Tên áo thun đã tồn tại!");
        }
        // Kiểm tra thương hiệu
        Optional<Brand> brand = brandRepository.findById(shirt.getBrand().getId());
        if (brand.isEmpty()) {
            throw new IllegalArgumentException("Thương hiệu không tồn tại!");
        }
        // Kiểm tra danh mục
        Optional<Category> category = categoryRepository.findById(shirt.getCategory().getId());
        if (category.isEmpty()) {
            throw new IllegalArgumentException("Danh mục không tồn tại!");
        }
        // Tạo mã sản phẩm ngẫu nhiên
        String generatedCode = "S" + generateRandomNumber(6);
        shirt.setCodeshirt(generatedCode);
        shirt.setStatusshirt(1);
        // Lưu vào cơ sở dữ liệu
        return shirtRepository.save(shirt);
    }

    public Shirt updateShirt(String codeshirt, Shirt updatedShirt) {
        // Tìm áo thun theo mã code
        Shirt existingShirt = shirtRepository.findByCodeshirt(codeshirt);

        if (existingShirt != null) {
            // Cập nhật các trường khác
            existingShirt.setCodeshirt(updatedShirt.getCodeshirt());
            existingShirt.setNameshirt(updatedShirt.getNameshirt());
            existingShirt.setCreateBy(updatedShirt.getCreateBy());

            // Cập nhật thương hiệu từ brandId
            if (updatedShirt.getBrand() != null && updatedShirt.getBrand().getId() != 0) {
                Brand brand = brandRepository.findById(updatedShirt.getBrand().getId()).orElse(null);
                if (brand != null) {
                    existingShirt.setBrand(brand);
                }
            }

            // Cập nhật danh mục từ categoryId
            if (updatedShirt.getCategory() != null && updatedShirt.getCategory().getId() != 0) {
                Category category = categoryRepository.findById(updatedShirt.getCategory().getId()).orElse(null);
                if (category != null) {
                    existingShirt.setCategory(category);
                }
            }
            existingShirt.setDescription(updatedShirt.getDescription());

            // Cập nhật các trường khác
            existingShirt.setStatusshirt(updatedShirt.getStatusshirt());
            existingShirt.setDeleted(updatedShirt.isDeleted());

            // Lưu lại và trả về áo thun đã được cập nhật
            return shirtRepository.save(existingShirt);
        }
        return null; // Nếu không tìm thấy áo thun theo mã
    }


    public Shirt deleteShirt(String codeshirt) {
        Shirt existingShirt = shirtRepository.findByCodeshirt(codeshirt);
        if (existingShirt != null) {
            existingShirt.setDeleted(true);
            return shirtRepository.save(existingShirt);
        }
        return null;
    }
//
//    public ShirtResponseDTO getShirtDetail(String codeshirt) {
//        return shirtRepository.findByCode(codeshirt);
//    }

    public Iterable<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Iterable<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    // Phương thức tạo số ngẫu nhiên với số lượng ký tự nhất định
    private String generateRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));  // Lấy ngẫu nhiên một số từ 0 đến 9
        }

        return sb.toString();
    }
}
