package com.example.bee_shirt.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "account")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//Access ModiFier
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(name = "create_at")
    LocalDate createAt;
    @Column(name = "update_at")
    LocalDate updateAt;
    @Column(name = "create_by")
    String createBy;
    @Column(name = "update_by")
    String updateBy;
    @Column(name = "deleted")
    Boolean deleted = false;
    @Column(name = "status_account")
    Integer status = 0;
    @Column(name = "code_account")
    String code;
    @Column(name = "username")
    String username;
    @Column(name = "pass")
    String pass;
    @Column(name = "first_name")
    String firstName;
    @Column(name = "last_name")
    String lastName;
    @Column(name = "avatar")
    String avatar;

    @Column(name = "phone_number")
    String phone;
    @Column(name = "email")
    String email;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "account_role",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> role;

}
