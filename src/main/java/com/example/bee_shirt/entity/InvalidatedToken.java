package com.example.bee_shirt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Entity
@Table(name = "invalidated_token")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidatedToken {
    @Id
    String id;

    @Column(name = "expiry_time")
    Date expiryTime;
}
