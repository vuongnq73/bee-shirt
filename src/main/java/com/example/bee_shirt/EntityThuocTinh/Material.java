package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "material")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_material")
    private String codeMaterial;

    @Column(name = "name_material")
    private String nameMaterial;

    @Column(name = "status_material")
    private int statusMaterial;

    @Column(name = "deleted")
    private boolean deleted;
}
