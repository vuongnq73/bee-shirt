package com.example.bee_shirt.service;

import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.entity.*;
import com.example.bee_shirt.exception.AppException;
import com.example.bee_shirt.exception.ErrorCode;
import com.example.bee_shirt.mapper.AccountMapper;
import com.example.bee_shirt.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartDetailRepository cartDetailRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AccountMapper accountMapper;

    @Autowired
    private CartRepository cartRepository;

    public List<CartDetail> getCartDetails(String codeAccount) {
        return cartDetailRepository.findCartDetailByAccountCodeAndStatusCartDetail(codeAccount, 0);
    }
    public AccountResponse getMyInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return accountMapper.toUserResponse(account);
    }
    public List<Integer> getCartIdsForCurrentAccount() {
        Integer accountId = this.getMyInfo().getId();
        return cartRepository.findCartIdsByAccountId(accountId);
    }


}
