package com.example.bee_shirt.service;

import com.example.bee_shirt.entity.BillDetail;
import com.example.bee_shirt.entity.Cart;
import com.example.bee_shirt.entity.CartDetail;
import com.example.bee_shirt.entity.ShirtDetail;
import com.example.bee_shirt.repository.BillRepository;
import com.example.bee_shirt.repository.CartDetailRepository;
import com.example.bee_shirt.repository.CartRepository;
import com.example.bee_shirt.repository.ShirtDetailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    public List<CartDetail> getCartDetails(String codeAccount) {
        return cartDetailRepository.findCartDetailByAccountCodeAndStatusCartDetail(codeAccount, 0);
    }

}
