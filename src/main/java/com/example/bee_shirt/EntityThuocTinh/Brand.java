package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "brand")
public class Brand {
    /*
    CREATE TABLE [dbo].[brand](
        [id] [int] IDENTITY(1,1) NOT NULL,
              [status_beleted] [bit] NULL,
        PRIMARY KEY CLUSTERED ([id])
    );
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_brand")
    private String codeBrand;

    @Column(name = "name_brand")
    private String nameBrand;

    @Column(name = "status_brand")
    private int statusBrand;

    @Column(name = "deleted")
    private boolean deleted;
    public Brand() {
    }
}
