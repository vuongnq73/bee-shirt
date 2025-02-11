USE [DATN_20224]
GO
/****** Object:  Table [dbo].[account]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_account] [varchar](50) NULL,
	[username] [varchar](20) NULL,
	[pass] [varchar](20) NULL,
	[first_name] [nvarchar](250) NULL,
	[last_name] [nvarchar](250) NULL,
	[avatar] [varchar](250) NULL,
	[address_account] [nvarchar](250) NULL,
	[phone_number] [varchar](20) NULL,
	[email] [varchar](225) NULL,
	[status_account] [int] NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[account_role]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account_role](
	[role_id] [int] NOT NULL,
	[account_id] [int] NOT NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[role_id] ASC,
	[account_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[bill]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bill](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[voucher_id] [int] NULL,
	[account_id] [int] NULL,
	[customer_id] [int] NULL,
	[code_bill] [varchar](50) NULL,
	[type_bill] [nvarchar](100) NULL,
	[customer_name] [nvarchar](250) NULL,
	[phone_number] [varchar](20) NULL,
	[address_customer] [text] NULL,
	[money_ship] [decimal](10, 2) NULL,
	[subtotal_before_discount] [decimal](10, 2) NULL,
	[money_reduce] [decimal](10, 2) NULL,
	[total_money] [decimal](10, 2) NULL,
	[create_date] [date] NULL,
	[desired_date] [date] NULL,
	[status_bill] [int] NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[note] [text] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[bill_detail]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bill_detail](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[shirt_detail_id] [int] NULL,
	[bill_id] [int] NULL,
	[code_bill_detail] [varchar](50) NULL,
	[quantity] [int] NULL,
	[price] [decimal](10, 2) NULL,
	[status_bill_detail] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[bill_payment]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bill_payment](
	[bill_payment_id] [int] IDENTITY(1,1) NOT NULL,
	[bill_id] [int] NOT NULL,
	[payment_method_id] [int] NOT NULL,
	[payment_amount] [decimal](10, 2) NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[bill_payment_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[brand]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[brand](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_brand] [varchar](50) NULL,
	[name_brand] [nvarchar](250) NULL,
	[status_brand] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NULL,
	[code_cart] [varchar](50) NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[status_cart] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cart_detail]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart_detail](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[shirt_detail_id] [int] NULL,
	[cart_id] [int] NULL,
	[code_cart_detail] [varchar](50) NULL,
	[quantity] [int] NULL,
	[status_cart_detail] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[category]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_category] [varchar](50) NULL,
	[name_category] [nvarchar](250) NULL,
	[status_category] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[color]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[color](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_color] [varchar](50) NULL,
	[name_color] [nvarchar](250) NULL,
	[status_color] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gender]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gender](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_gender] [varchar](50) NULL,
	[name_gender] [nvarchar](250) NULL,
	[status_gender] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[image_shirt_detail]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[image_shirt_detail](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[shirt_detail_id] [int] NULL,
	[code_image] [varchar](50) NULL,
	[name_image] [nvarchar](250) NULL,
	[main_image] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[material]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[material](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_material] [varchar](50) NULL,
	[name_material] [nvarchar](250) NULL,
	[status_material] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[origin]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[origin](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_origin] [varchar](50) NULL,
	[name_origin] [nvarchar](250) NULL,
	[status_origin] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pattern]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pattern](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_pattern] [varchar](50) NULL,
	[name_pattern] [nvarchar](250) NULL,
	[status_pattern] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payment_method]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payment_method](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_paymentmethod] [varchar](50) NULL,
	[name_paymentmethod] [nvarchar](100) NULL,
	[status_paymentmethod] [int] NULL,
	[note] [text] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[role_A]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[role_A](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_role] [varchar](50) NULL,
	[name_role] [nvarchar](100) NULL,
	[status_role] [int] NULL,
	[description_role] [text] NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[season]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[season](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_season] [varchar](50) NULL,
	[name_season] [nvarchar](250) NULL,
	[status_season] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shirt]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shirt_detail]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shirt_detail](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[shirt_id] [int] NULL,
	[brand_id] [int] NULL,
	[pattern_id] [int] NULL,
	[gender_id] [int] NULL,
	[origin_id] [int] NULL,
	[season_id] [int] NULL,
	[size_id] [int] NULL,
	[material_id] [int] NULL,
	[color_id] [int] NULL,
	[code_shirt_detail] [varchar](50) NULL,
	[price] [decimal](10, 2) NULL,
	[quantity] [int] NULL,
	[status_shirt_detail] [int] NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[size]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[size](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_size] [varchar](50) NULL,
	[name_size] [nvarchar](250) NULL,
	[status_size] [int] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher]    Script Date: 11/3/2024 1:47:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_voucher] [varchar](50) NULL,
	[type_voucher] [varchar](100) NULL,
	[name_voucher] [varchar](250) NULL,
	[discount_value] [decimal](10, 2) NULL,
	[quantity] [int] NULL,
	[min_bill_value] [decimal](10, 2) NULL,
	[maximum_discount] [decimal](10, 2) NULL,
	[startdate] [date] NULL,
	[enddate] [date] NULL,
	[status_voucher] [int] NULL,
	[description_voucher] [text] NULL,
	[create_by] [nvarchar](100) NULL,
	[create_at] [date] NULL,
	[update_by] [nvarchar](100) NULL,
	[update_at] [date] NULL,
	[deleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
CREATE TABLE verification_token (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,   -- Sử dụng IDENTITY thay cho AUTO_INCREMENT
    token VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL          -- Sử dụng DATETIME cho kiểu thời gian trong SQL Server
)
go
ALTER TABLE [dbo].[account] ADD  DEFAULT ((0)) FOR [status_account]
GO
ALTER TABLE [dbo].[account] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[account] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[account] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[account_role] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[bill] ADD  DEFAULT (getdate()) FOR [create_date]
GO
ALTER TABLE [dbo].[bill] ADD  DEFAULT (getdate()) FOR [desired_date]
GO
ALTER TABLE [dbo].[bill] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[bill] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[bill] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[bill_detail] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[bill_payment] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[brand] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[cart] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[cart_detail] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[category] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[color] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[gender] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[image_shirt_detail] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[material] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[origin] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[pattern] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[payment_method] ADD  DEFAULT ((0)) FOR [status_paymentmethod]
GO
ALTER TABLE [dbo].[payment_method] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[role_A] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[role_A] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[role_A] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[season] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[shirt] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[shirt] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[shirt] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[shirt_detail] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[shirt_detail] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[shirt_detail] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[size] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[voucher] ADD  DEFAULT (getdate()) FOR [startdate]
GO
ALTER TABLE [dbo].[voucher] ADD  DEFAULT (getdate()) FOR [enddate]
GO
ALTER TABLE [dbo].[voucher] ADD  DEFAULT ((0)) FOR [status_voucher]
GO
ALTER TABLE [dbo].[voucher] ADD  DEFAULT (getdate()) FOR [create_at]
GO
ALTER TABLE [dbo].[voucher] ADD  DEFAULT (getdate()) FOR [update_at]
GO
ALTER TABLE [dbo].[voucher] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[account_role]  WITH CHECK ADD  CONSTRAINT [fk_accountRole_role] FOREIGN KEY([role_id])
REFERENCES [dbo].[role_A] ([id])
GO
ALTER TABLE [dbo].[account_role] CHECK CONSTRAINT [fk_accountRole_role]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [fk_bill_voucher] FOREIGN KEY([voucher_id])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [fk_bill_voucher]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [fk_customer_account] FOREIGN KEY([customer_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [fk_customer_account]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [fk_staff_account] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [fk_staff_account]
GO
ALTER TABLE [dbo].[bill_detail]  WITH CHECK ADD  CONSTRAINT [fk_billdetail_bill] FOREIGN KEY([bill_id])
REFERENCES [dbo].[bill] ([id])
GO
ALTER TABLE [dbo].[bill_detail] CHECK CONSTRAINT [fk_billdetail_bill]
GO
ALTER TABLE [dbo].[bill_detail]  WITH CHECK ADD  CONSTRAINT [fk_billdetail_shirtDetail] FOREIGN KEY([shirt_detail_id])
REFERENCES [dbo].[shirt_detail] ([id])
GO
ALTER TABLE [dbo].[bill_detail] CHECK CONSTRAINT [fk_billdetail_shirtDetail]
GO
ALTER TABLE [dbo].[bill_payment]  WITH CHECK ADD  CONSTRAINT [fk_billpayment_bill] FOREIGN KEY([bill_id])
REFERENCES [dbo].[bill] ([id])
GO
ALTER TABLE [dbo].[bill_payment] CHECK CONSTRAINT [fk_billpayment_bill]
GO
ALTER TABLE [dbo].[bill_payment]  WITH CHECK ADD  CONSTRAINT [fk_billpayment_paymentmedhod] FOREIGN KEY([payment_method_id])
REFERENCES [dbo].[payment_method] ([id])
GO
ALTER TABLE [dbo].[bill_payment] CHECK CONSTRAINT [fk_billpayment_paymentmedhod]
GO
ALTER TABLE [dbo].[cart_detail]  WITH CHECK ADD  CONSTRAINT [fk_cartdetail_cart] FOREIGN KEY([cart_id])
REFERENCES [dbo].[cart] ([id])
GO
ALTER TABLE [dbo].[cart_detail] CHECK CONSTRAINT [fk_cartdetail_cart]
GO
ALTER TABLE [dbo].[cart_detail]  WITH CHECK ADD  CONSTRAINT [fk_cartdetail_shirtDetail] FOREIGN KEY([shirt_detail_id])
REFERENCES [dbo].[shirt_detail] ([id])
GO
ALTER TABLE [dbo].[cart_detail] CHECK CONSTRAINT [fk_cartdetail_shirtDetail]
GO
ALTER TABLE [dbo].[image_shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_image_shirtDetail] FOREIGN KEY([shirt_detail_id])
REFERENCES [dbo].[shirt_detail] ([id])
GO
ALTER TABLE [dbo].[image_shirt_detail] CHECK CONSTRAINT [fk_image_shirtDetail]
GO
ALTER TABLE [dbo].[shirt]  WITH CHECK ADD  CONSTRAINT [fk_shirt_brand] FOREIGN KEY([brand_id])
REFERENCES [dbo].[brand] ([id])
GO
ALTER TABLE [dbo].[shirt] CHECK CONSTRAINT [fk_shirt_brand]
GO
ALTER TABLE [dbo].[shirt]  WITH CHECK ADD  CONSTRAINT [fk_shirt_category] FOREIGN KEY([category_id])
REFERENCES [dbo].[category] ([id])
GO
ALTER TABLE [dbo].[shirt] CHECK CONSTRAINT [fk_shirt_category]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_color] FOREIGN KEY([color_id])
REFERENCES [dbo].[color] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_color]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_gender] FOREIGN KEY([gender_id])
REFERENCES [dbo].[gender] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_gender]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_material] FOREIGN KEY([material_id])
REFERENCES [dbo].[material] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_material]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_origin] FOREIGN KEY([origin_id])
REFERENCES [dbo].[origin] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_origin]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_pattern] FOREIGN KEY([pattern_id])
REFERENCES [dbo].[pattern] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_pattern]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_season] FOREIGN KEY([season_id])
REFERENCES [dbo].[season] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_season]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_shirt] FOREIGN KEY([shirt_id])
REFERENCES [dbo].[shirt] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_shirt]
GO
ALTER TABLE [dbo].[shirt_detail]  WITH CHECK ADD  CONSTRAINT [fk_shirtDetail_size] FOREIGN KEY([size_id])
REFERENCES [dbo].[size] ([id])
GO
ALTER TABLE [dbo].[shirt_detail] CHECK CONSTRAINT [fk_shirtDetail_size]
GO

ALTER TABLE account ALTER COLUMN pass NVARCHAR(500);

ALTER TABLE account ALTER COLUMN username VARCHAR(225);
