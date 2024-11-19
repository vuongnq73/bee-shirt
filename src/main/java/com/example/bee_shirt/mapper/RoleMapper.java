package com.example.bee_shirt.mapper;

import com.example.bee_shirt.dto.response.RoleResponse;
import com.example.bee_shirt.entity.Role;
import org.mapstruct.Mapper;

//báo cho Maptruct bt class này để sd trong spring
@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse toRoleResponse(Role role);
}
