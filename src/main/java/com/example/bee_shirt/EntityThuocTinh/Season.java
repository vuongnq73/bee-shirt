package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "season")
public class Season {
    /*
    CREATE TABLE [dbo].[season](
        [id] [int] IDENTITY(1,1) NOT NULL,
             [status_seleted] [bit] NULL,
        PRIMARY KEY CLUSTERED ([id])
    );
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_season")
    private String codeSeason;

    @Column(name = "name_season")
    private String nameSeason;

    @Column(name = "status_season")
    private int statusSeason;

    @Column(name = "deleted")
    private boolean deleted;
}
