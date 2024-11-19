package com.example.bee_shirt.service.lmp;

import com.example.bee_shirt.EntityThuocTinh.*;
import com.example.bee_shirt.dto.ShirtDetailDTO;
import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class ShirtDetailService {

    @Autowired private ShirtDetailRepository shirtDetailRepository;
    @Autowired private PatternRepository patternRepository;
    @Autowired private GenderRepository genderRepository;
    @Autowired private OriginRepository originRepository;
    @Autowired private SeasonRepository seasonRepository;
    @Autowired private SizeRepository sizeRepository;
    @Autowired private MaterialRepository materialRepository;
    @Autowired private ColorRepository colorRepository;
    @Autowired private ShirtRepository shirtRepository;

    // Lấy tất cả chi tiết áo
    public Page<ShirtDetailDTO> getAllShirtDetails(Pageable pageable) {
        return shirtDetailRepository.findAllShirtDetails(pageable);
    }

    // Thêm chi tiết áo
    public ShirtDetail addShirtDetail(ShirtDetail shirtDetail) {
        // Tạo mã ngẫu nhiên bắt đầu bằng "S" và theo sau là 6 số ngẫu nhiên
        String generatedCode = "SDT" + generateRandomNumber(6);

        // Gán mã sản phẩm vào đối tượng shirt
        shirtDetail.setCodeShirtDetail(generatedCode);
        return shirtDetailRepository.save(shirtDetail);
    }

    // Cập nhật chi tiết áo
    public ShirtDetail updateShirtDetail(String codeShirtDetail, ShirtDetail updatedShirtDetail) {
        ShirtDetail shirtDetail = shirtDetailRepository.findByCodeShirtDetail(codeShirtDetail);

        if (shirtDetail != null) {
            // Cập nhật các trường, chỉ cập nhật nếu giá trị không phải là null
            shirtDetail.setCodeShirtDetail(updatedShirtDetail.getCodeShirtDetail());
            shirtDetail.setQuantity(updatedShirtDetail.getQuantity());
           shirtDetail.setPrice(updatedShirtDetail.getPrice());
           shirtDetail.setStatusshirtdetail(updatedShirtDetail.getStatusshirtdetail());
           shirtDetail.setDeleted(updatedShirtDetail.isDeleted());
           // Cập nhật các thuộc tính
            if (updatedShirtDetail.getShirt() != null && updatedShirtDetail.getShirt().getId() != 0) {
                Shirt shirt = shirtRepository.findById(updatedShirtDetail.getShirt().getId()).orElse(null);
                if (shirt != null) {
                    shirtDetail.setShirt(shirt);
                }
            }
            if (updatedShirtDetail.getColor() != null && updatedShirtDetail.getColor().getId() != 0) {
                Color color = colorRepository.findById(updatedShirtDetail.getColor().getId()).orElse(null);
                if (color != null) {
                    shirtDetail.setColor(color);
                }
            }
            if (updatedShirtDetail.getGender() != null && updatedShirtDetail.getGender().getId() != 0) {
                Gender gender = genderRepository.findById(updatedShirtDetail.getGender().getId()).orElse(null);
                if (gender != null) {
                    shirtDetail.setGender(gender);
                }
            }
            if (updatedShirtDetail.getMaterial() != null && updatedShirtDetail.getMaterial().getId() != 0) {
                Material material = materialRepository.findById(updatedShirtDetail.getMaterial().getId()).orElse(null);
                if (material != null) {
                    shirtDetail.setMaterial(material);  // Set material to ShirtDetail
                }
            }

            if (updatedShirtDetail.getOrigin() != null && updatedShirtDetail.getOrigin().getId() != 0) {
                Origin origin = originRepository.findById(updatedShirtDetail.getOrigin().getId()).orElse(null);
                if (origin != null) {
                    shirtDetail.setOrigin(origin);  // Set origin to ShirtDetail
                }
            }

            if (updatedShirtDetail.getPattern() != null && updatedShirtDetail.getPattern().getId() != 0) {
                Pattern pattern = patternRepository.findById(updatedShirtDetail.getPattern().getId()).orElse(null);
                if (pattern != null) {
                    shirtDetail.setPattern(pattern);  // Set pattern to ShirtDetail
                }
            }

            if (updatedShirtDetail.getSeason() != null && updatedShirtDetail.getSeason().getId() != 0) {
                Season season = seasonRepository.findById(updatedShirtDetail.getSeason().getId()).orElse(null);
                if (season != null) {
                    shirtDetail.setSeason(season);  // Set season to ShirtDetail
                }
            }

            if (updatedShirtDetail.getSize() != null && updatedShirtDetail.getSize().getId() != 0) {
                Size size = sizeRepository.findById(updatedShirtDetail.getSize().getId()).orElse(null);
                if (size != null) {
                    shirtDetail.setSize(size);  // Set size to ShirtDetail
                }
            }
            return shirtDetailRepository.save(shirtDetail);
        }
        return null; // Trả về null nếu không tìm thấy chi tiết áo
    }

    public ShirtDetail deleteShirtDetail(String codeShirtDetail) {
        ShirtDetail shirtDetail = shirtDetailRepository.findByCodeShirtDetail(codeShirtDetail);
        if (shirtDetail != null) {
            shirtDetail.setDeleted(true);
            return shirtDetailRepository.save(shirtDetail);
        }
        return null;
    }

    private String generateRandomNumber(int length) {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10)); // random digit between 0-9
        }
        return sb.toString();
    }

    public ShirtDetailDTO getShirtDetail(String codeShirtDetail) {
        // Tìm kiếm ShirtDetail theo mã codeShirtDetail
        ShirtDetail shirtDetail = shirtDetailRepository.findByCodeShirtDetail(codeShirtDetail);
        System.out.println(shirtDetail.getCodeShirtDetail());
        if (shirtDetail != null) {
            // Chuyển đổi ShirtDetail thành ShirtDetailDTO và trả về
            ShirtDetailDTO shirtDetailDTO = new ShirtDetailDTO(
                    shirtDetail.getId(),
                    shirtDetail.getCodeShirtDetail(),
                    shirtDetail.getShirt().getNameshirt(),
                    shirtDetail.getPrice(),
                    shirtDetail.getQuantity(),
                    shirtDetail.getPattern() != null ? shirtDetail.getPattern().getNamePattern() : null,
                    shirtDetail.getGender() != null ? shirtDetail.getGender().getNameGender() : null,
                    shirtDetail.getOrigin() != null ? shirtDetail.getOrigin().getNameOrigin() : null,
                    shirtDetail.getSeason() != null ? shirtDetail.getSeason().getNameSeason() : null,
                    shirtDetail.getSize() != null ? shirtDetail.getSize().getNamesize() : null,
                    shirtDetail.getMaterial() != null ? shirtDetail.getMaterial().getNameMaterial() : null,
                    shirtDetail.getColor() != null ? shirtDetail.getColor().getNameColor() : null,
                    shirtDetail.getStatusshirtdetail(),
                    shirtDetail.getCreateBy(),
                    shirtDetail.getCreateAt(),
                    shirtDetail.getUpdateBy(),
                    shirtDetail.getUpdateAt(),
                    shirtDetail.isDeleted(),
                    shirtDetail.getShirt().getId(),
                    shirtDetail.getPattern() != null ? shirtDetail.getPattern().getId() : 0,
                    shirtDetail.getGender() != null ? shirtDetail.getGender().getId() : 0,
                    shirtDetail.getOrigin() != null ? shirtDetail.getOrigin().getId() : 0,
                    shirtDetail.getSeason() != null ? shirtDetail.getSeason().getId() : 0,
                    shirtDetail.getSize() != null ? shirtDetail.getSize().getId() : 0,
                    shirtDetail.getMaterial() != null ? shirtDetail.getMaterial().getId() : 0,
                    shirtDetail.getColor() != null ? shirtDetail.getColor().getId() : 0
            );

            return shirtDetailDTO;
        }

        // Nếu không tìm thấy ShirtDetail, trả về null hoặc có thể trả về 404 trong controller
        return null;
    }



    // Lấy tất cả các màu sắc
    public Iterable<Color> getAllColors() {
        return colorRepository.findAll();
    }

    // Lấy tất cả các giới tính
    public Iterable<Gender> getAllGenders() {
        return genderRepository.findAll();
    }

    // Lấy tất cả các mẫu áo
    public Iterable<Pattern> getAllPatterns() {
        return patternRepository.findAll();
    }

    // Lấy tất cả các kích cỡ
    public Iterable<Size> getAllSizes() {
        return sizeRepository.findAll();
    }

    // Lấy tất cả các chất liệu
    public Iterable<Material> getAllMaterials() {
        return materialRepository.findAll();
    }

    // Lấy tất cả các mùa
    public Iterable<Season> getAllSeasons() {
        return seasonRepository.findAll();
    }
    public Iterable<Origin> getAllOrigins() {
        return originRepository.findAll();
    }
    public Iterable<Shirt> getAllShirts() {
        return shirtRepository.findAll();
    }

}
