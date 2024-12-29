package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.AddToCartRequestDTO;
import com.example.bee_shirt.entity.Cart;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import com.example.bee_shirt.repository.CartDetailRepository;
import com.example.bee_shirt.repository.CartRepository;
import com.example.bee_shirt.repository.ShirtDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;
@Service
public class CartDetailService {

    @Autowired
    private ShirtDetailRepository shirtDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartDetailRepository cartDetailRepository;

    public CartDetail addToCart(AddToCartRequestDTO addToCartRequestDTO) {
        // Kiểm tra nếu cartId là null hoặc không hợp lệ thì đặt giá trị mặc định
        Integer cartId = (addToCartRequestDTO.getCartId() != null) ? addToCartRequestDTO.getCartId() : 1;

        // Kiểm tra xem giỏ hàng và chi tiết áo có tồn tại không
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại"));

        ShirtDetail shirtDetail = shirtDetailRepository.findById(addToCartRequestDTO.getShirtDetailId())
                .orElseThrow(() -> new IllegalArgumentException("Chi tiết áo không tồn tại"));

        // Tạo đối tượng CartDetail
        CartDetail cartDetail = new CartDetail();
        cartDetail.setCodeCartDetail(generateOriginCode());
        cartDetail.setCart(cart);
        cartDetail.setShirtDetail(shirtDetail);
        cartDetail.setQuantity(1);  // Default quantity = 1
        cartDetail.setStatusCartDetail(1);
        cartDetail.setDeleted(false);

        // Lưu đối tượng CartDetail vào cơ sở dữ liệu
        return cartDetailRepository.save(cartDetail);
    }

    // Hàm tạo mã ngẫu nhiên cho Origin
    private String generateOriginCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "CA" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }
}
