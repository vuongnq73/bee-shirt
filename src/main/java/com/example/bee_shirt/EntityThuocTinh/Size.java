package com.example.bee_shirt.EntityThuocTinh;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Data
@Table(name = "size")
public class Size {
    /*

CREATE TABLE [dbo].[size](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_size] [varchar](50) NULL,
	[name_size] [nvarchar](250) NULL,
	[status_size] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "code_size")
    private String codeSize;
    @Column(name = "name_size")
    private String namesize;
    @Column(name = "status_size")
    private int statussize;
    @Column(name = "deleted")
    private boolean deleted;


}
