package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "color")
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_color")
    private String codeColor;

    @Column(name = "name_color")
    private String nameColor;

    @Column(name = "status_color")
    private int statusColor;

    @Column(name = "deleted")
    private boolean deleted;
}
