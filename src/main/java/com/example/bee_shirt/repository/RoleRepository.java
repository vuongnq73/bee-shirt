package com.example.bee_shirt.repository;

import com.example.bee_shirt.dto.response.RoleResponse;
import com.example.bee_shirt.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findRoleByCode(String code);
}
