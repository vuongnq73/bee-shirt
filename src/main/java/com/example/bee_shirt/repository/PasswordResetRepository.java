package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset,Long> {
    Optional<PasswordReset> findByToken(String token);
    Optional<PasswordReset> findByEmail(String email);
}
