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
        // Nếu `cartId` không được cung cấp, gán giá trị mặc định là 1
        Integer cartId = addToCartRequestDTO.getCartId() != null
                ? addToCartRequestDTO.getCartId()
                : 1;  // Sử dụng giá trị kiểu Integer

        // Lấy giỏ hàng từ cơ sở dữ liệu
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Giỏ hàng không tồn tại với ID: " + cartId));

        // Kiểm tra xem chi tiết áo có tồn tại không
        ShirtDetail shirtDetail = shirtDetailRepository.findById(addToCartRequestDTO.getShirtDetailId())
                .orElseThrow(() -> new IllegalArgumentException("Chi tiết áo không tồn tại với ID: " + addToCartRequestDTO.getShirtDetailId()));

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng (trạng thái 0) hay chưa
        Optional<CartDetail> existingCartDetail = cartDetailRepository.findByCartAndShirtDetailAndStatusCartDetail(cart, shirtDetail, 0);

        if (existingCartDetail.isPresent()) {
            // Nếu tìm thấy sản phẩm có trạng thái 0, xử lý logic tăng số lượng
            CartDetail cartDetail = existingCartDetail.get();
            cartDetail.setQuantity(cartDetail.getQuantity() + 1); // Tăng số lượng lên 1
            return cartDetailRepository.save(cartDetail);
        } else {
            // Nếu không tìm thấy sản phẩm, tạo mới CartDetail
            CartDetail newCartDetail = new CartDetail();
            newCartDetail.setCodeCartDetail(generateOriginCode());
            newCartDetail.setCart(cart);
            newCartDetail.setShirtDetail(shirtDetail);
            newCartDetail.setQuantity(1);
            newCartDetail.setStatusCartDetail(0); // Trạng thái là 0
            newCartDetail.setDeleted(false);

            return cartDetailRepository.save(newCartDetail);
        }
    }


    // Hàm tạo mã ngẫu nhiên cho Origin
    private String generateOriginCode() {
        Random random = new Random();
        int randomCode = random.nextInt(100000);  // Sinh số ngẫu nhiên trong phạm vi từ 0 - 99999
        return "CA" + String.format("%05d", randomCode);  // Đảm bảo mã luôn có 5 chữ số
    }
}
