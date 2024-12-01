package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "pattern")
public class Pattern {
    /*
    CREATE TABLE [dbo].[pattern](
        [id] [int] IDENTITY(1,1) NOT NULL,
            [status_pateted] [bit] NULL
    );
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_pattern")
    private String codePattern;

    @Column(name = "name_pattern")
    private String namePattern;

    @Column(name = "status_pattern")
    private int statusPattern;

    @Column(name = "deleted")
    private boolean deleted;
}
