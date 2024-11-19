package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "role_A")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(name = "code_role")
    String code;
    @Column(name = "status_role")
    Integer status;
    @Column(name = "name_role")
    String name;
    @Column(name = "description_role")
    String description;
    @Column(name = "create_at")
    LocalDate createAt;
    @Column(name = "update_at")
    LocalDate updateAt;
    @Column(name = "create_by")
    String createBy;
    @Column(name = "update_by")
    String updateBy;
    @Column(name = "deleted")
    Boolean deleted;
}
