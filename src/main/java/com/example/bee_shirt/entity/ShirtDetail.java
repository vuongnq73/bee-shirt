package com.example.bee_shirt.entity;

import com.example.bee_shirt.EntityThuocTinh.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Getter
@Setter
@Data
@Table(name = "shirt_detail")
public class ShirtDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name="shirt_id", nullable = false)
    private Shirt shirt;

    @ManyToOne
    @JoinColumn(name = "pattern_id", nullable = false)
    private Pattern pattern;

    @ManyToOne
    @JoinColumn(name = "gender_id", nullable = false)
    private Gender gender;

    @ManyToOne
    @JoinColumn(name = "origin_id", nullable = false)
    private Origin origin;

    @ManyToOne
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @ManyToOne
    @JoinColumn(name = "size_id", nullable = false)
    private Size size;

    @ManyToOne
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @ManyToOne
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @Column(name = "code_shirt_detail")
    private String codeShirtDetail;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "status_shirt_detail")
    private int statusshirtdetail;

    @Column(name = "create_by")
    private String createBy;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "image")
    private String image;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "deleted")
    private boolean deleted;
    @PrePersist
    public void prePersist() {
        if (createAt == null) {
            createAt = new Date(System.currentTimeMillis());  // Gán thời gian hiện tại nếu chưa có giá trị
        }
        if (updateAt == null) {
            updateAt = new Date(System.currentTimeMillis());  // Gán thời gian hiện tại nếu chưa có giá trị
        }
    }
}
