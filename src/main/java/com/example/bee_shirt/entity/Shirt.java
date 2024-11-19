package com.example.bee_shirt.entity;

import com.example.bee_shirt.EntityThuocTinh.Brand;
import com.example.bee_shirt.EntityThuocTinh.Category;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Data
@Table(name = "shirt")
public class Shirt {

    /*
CREATE TABLE [dbo].[shirt](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[brand_id] [int] NULL,
	[category_id] [int] NULL,
	[code_shirt] [varchar](50) NULL,
	[name_shirt] [nvarchar](250) NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[status_shirt] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED
(
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "brand_id" ,nullable = false)
    private Brand brand;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Column(name = "code_shirt")
    private String codeshirt;
    @Column(name ="name_shirt" )
    private String nameshirt;
    @Column(name = "create_by")
    private String createBy;
    @Column(name = "create_at")
    private Date createAt;
    @Column(name = "update_by")
    private String updateBy;
    @Column(name = "update_at")
    private Date updateat;
    @Column(name = "status_shirt")
    private Integer statusshirt;
    @Column(name = "deleted")
    private boolean deleted;
    @PrePersist
    public void prePersist() {
        if (createAt == null) {
            createAt = new Date(System.currentTimeMillis());  // Gán thời gian hiện tại nếu chưa có giá trị
        }
        if (updateat == null) {
            updateat = new Date(System.currentTimeMillis());  // Gán thời gian hiện tại nếu chưa có giá trị
        }
    }
}
