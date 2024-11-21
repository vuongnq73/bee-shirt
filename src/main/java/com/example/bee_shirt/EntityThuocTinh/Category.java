package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "category")
public class Category {
    /*
    CREATE TABLE [dbo].[category](
        [id] [int] IDENTITY(1,1) NOT NULL,
        y] [nvarchar](2ory] [int] NULL,
        [deleted] [bit] NULL
    );
    */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "code_category")
    private String codeCategory;

    @Column(name = "name_category")
    private String nameCategory;

    @Column(name = "status_category")
    private int statusCategory;

    @Column(name = "deleted")
    private boolean deleted;
    public Category() {
    }
}
