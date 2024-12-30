package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.AddToCartRequestDTO;
import com.example.bee_shirt.entity.Cart;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import com.example.bee_shirt.mapper.AccountMapper;
import com.example.bee_shirt.repository.AccountRepository;
import com.example.bee_shirt.repository.CartDetailRepository;
import com.example.bee_shirt.repository.CartRepository;
import com.example.bee_shirt.repository.ShirtDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
@Service
public class CartDetailService {

    @Autowired
    private ShirtDetailRepository shirtDetailRepository;

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private CartDetailRepository cartDetailRepository;
    public CartDetail addToCart(AddToCartRequestDTO addToCartRequestDTO) {
        // Kiểm tra xem cartId có hợp lệ hay không
        if (addToCartRequestDTO.getCartId() == null) {
            throw new IllegalArgumentException("Giỏ hàng không được để trống.");
        }

        // Lấy giỏ hàng từ cơ sở dữ liệu
        Cart cart = cartRepository.findById(addToCartRequestDTO.getCartId())
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại với ID: " + addToCartRequestDTO.getCartId()));

        // Kiểm tra xem chi tiết áo có tồn tại không
        ShirtDetail shirtDetail = shirtDetailRepository.findById(addToCartRequestDTO.getShirtDetailId())
                .orElseThrow(() -> new IllegalArgumentException("Chi tiết áo không tồn tại với ID: " + addToCartRequestDTO.getShirtDetailId()));

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        Optional<CartDetail> existingCartDetail = cartDetailRepository.findByCartAndShirtDetail(cart, shirtDetail);
        if (existingCartDetail.isPresent()) {
            // Nếu sản phẩm đã tồn tại, bạn có thể tăng số lượng sản phẩm trong giỏ hàng
            CartDetail cartDetail = existingCartDetail.get();
            cartDetail.setQuantity(cartDetail.getQuantity() + 1); // Tăng số lượng lên 1
            return cartDetailRepository.save(cartDetail); // Cập nhật CartDetail với số lượng mới
        }

        // Tạo mới đối tượng CartDetail nếu sản phẩm chưa có trong giỏ hàng
        CartDetail cartDetail = new CartDetail();
        cartDetail.setCodeCartDetail(generateOriginCode()); // Hàm này cần đảm bảo sinh mã duy nhất
        cartDetail.setCart(cart);
        cartDetail.setShirtDetail(shirtDetail);
        cartDetail.setQuantity(1);  // Số lượng mặc định là 1
        cartDetail.setStatusCartDetail(1); // Trạng thái mặc định
        cartDetail.setDeleted(false);      // Chưa bị xóa

        // Lưu đối tượng CartDetail vào cơ sở dữ liệu và trả về
        return cartDetailRepository.save(cartDetail);
    }

    // Hàm tạo mã ngẫu nhiên cho Origin
    private String generateOriginCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "CA" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }
}
