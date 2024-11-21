package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "gender")
public class Gender {
    /*
    CREATE TABLE [dbo].[gender](
        [id] [int] IDENTITY(1,1) NOT NULL,
             [status_geleted] [bit] NULL
    );
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_gender")
    private String codeGender;

    @Column(name = "name_gender")
    private String nameGender;

    @Column(name = "status_gender")
    private int statusGender;

    @Column(name = "deleted")
    private boolean deleted;
}
