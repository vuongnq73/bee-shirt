package com.example.bee_shirt.EntityThuocTinh;

import com.example.bee_shirt.entity.ShirtDetail;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "image_shirt_detail")
public class Image {
    /*
    CREATE TABLE [dbo].[image_shirt_detail](
        [id] [int] IDENTITY(1,1) NOT NULL,
        [shirt_detail_id] [int] NULL,
              [main_imaeted] [bit] NULL
    );
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "shirt_detail_id")
    private ShirtDetail shirtDetail;

    @Column(name = "code_image")
    private String codeImage;

    @Column(name = "name_image")
    private String nameImage;

    @Column(name = "main_image")
    private int mainImage;

    @Column(name = "deleted")
    private boolean deleted;
}
