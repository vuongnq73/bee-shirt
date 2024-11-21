package com.example.bee_shirt.mapper;

import com.example.bee_shirt.dto.request.AccountCreationRequest;
import com.example.bee_shirt.dto.request.AccountUpdateRequest;
import com.example.bee_shirt.dto.response.AccountResponse;
import com.example.bee_shirt.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "role",ignore = true)
    Account toUser(AccountCreationRequest request);

    @Mapping(target = "role",ignore = true)
    void updateUser(@MappingTarget Account account, AccountUpdateRequest request);

    AccountResponse toUserResponse(Account account);
}
