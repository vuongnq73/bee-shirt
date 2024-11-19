package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "origin")
public class Origin {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_origin")
    private String codeOrigin;

    @Column(name = "name_origin")
    private String nameOrigin;

    @Column(name = "status_origin")
    private int statusOrigin;

    @Column(name = "deleted")
    private boolean deleted;
}
