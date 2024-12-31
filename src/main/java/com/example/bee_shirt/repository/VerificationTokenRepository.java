package com.example.bee_shirt.repository;

import com.example.bee_shirt.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    // Truy vấn lấy tất cả các bản ghi và sắp xếp theo id giảm dần
    @Query("SELECT v FROM VerificationToken v WHERE v.email = :email ORDER BY v.id DESC")
    List<VerificationToken> findByEmail(@Param("email") String email);

    @Modifying
    @Query("DELETE FROM VerificationToken v WHERE v.expiryDate < CURRENT_TIMESTAMP")
    void deleteExpiredTokens();
}

