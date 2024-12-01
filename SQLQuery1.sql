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



-- 1. Insert dữ liệu vào bảng account_role
INSERT INTO [dbo].[account_role] ([role_id], [account_id], [deleted])
VALUES (1, 1, 0),
       (2, 2, 0),
       (3, 3, 0),
       (1, 4, 0),
       (2, 5, 0);

-- 2. Insert dữ liệu vào bảng bill
INSERT INTO [dbo].[bill] ([voucher_id], [account_id], [customer_id], [code_bill], [type_bill], [customer_name], [phone_number], [address_customer], [money_ship], [subtotal_before_discount], [money_reduce], [total_money], [create_date], [desired_date], [status_bill], [create_by], [create_at], [update_by], [update_at], [note], [deleted])
VALUES (1, 1, 1, 'BILL001', 'Online', 'John Doe', '123-456-7890', '123 Main St', 10.00, 100.00, 5.00, 105.00, '2024-11-01', '2024-11-05', 1, 'admin', '2024-11-01', 'admin', '2024-11-01', 'No notes', 0),
       (2, 2, 2, 'BILL002', 'In-store', 'Jane Smith', '234-567-8901', '456 Oak St', 5.00, 200.00, 10.00, 195.00, '2024-11-02', '2024-11-06', 1, 'admin', '2024-11-02', 'admin', '2024-11-02', 'Urgent delivery', 0),
       (3, 3, 3, 'BILL003', 'Online', 'Sam Wilson', '345-678-9012', '789 Pine St', 15.00, 300.00, 20.00, 295.00, '2024-11-03', '2024-11-07', 1, 'admin', '2024-11-03', 'admin', '2024-11-03', 'Gift wrapping', 0),
       (4, 4, 4, 'BILL004', 'In-store', 'Laura Brown', '456-789-0123', '101 Maple St', 7.00, 150.00, 5.00, 152.00, '2024-11-04', '2024-11-08', 1, 'admin', '2024-11-04', 'admin', '2024-11-04', 'N/A', 0),
       (5, 5, 5, 'BILL005', 'Online', 'Tom Davis', '567-890-1234', '202 Birch St', 12.00, 250.00, 15.00, 247.00, '2024-11-05', '2024-11-09', 1, 'admin', '2024-11-05', 'admin', '2024-11-05', 'Check discount', 0);

-- 3. Insert dữ liệu vào bảng bill_detail
INSERT INTO [dbo].[bill_detail] ([shirt_detail_id], [bill_id], [code_bill_detail], [quantity], [price], [status_bill_detail], [deleted])
VALUES (1, 1, 'BD001', 2, 50.00, 1, 0),
       (2, 2, 'BD002', 3, 60.00, 1, 0),
       (3, 3, 'BD003', 1, 100.00, 1, 0),
       (4, 4, 'BD004', 4, 40.00, 1, 0),
       (5, 5, 'BD005', 2, 75.00, 1, 0);

-- 4. Insert dữ liệu vào bảng bill_payment
INSERT INTO [dbo].[bill_payment] ([bill_id], [payment_method_id], [payment_amount], [deleted])
VALUES (1, 1, 105.00, 0),
       (2, 2, 195.00, 0),
       (3, 1, 295.00, 0),
       (4, 3, 152.00, 0),
       (5, 2, 247.00, 0);

-- 5. Insert dữ liệu vào bảng brand
INSERT INTO [dbo].[brand] ([code_brand], [name_brand], [status_brand], [deleted])
VALUES ('B001', 'Nike', 1, 0),
       ('B002', 'Adidas', 1, 0),
       ('B003', 'Puma', 1, 0),
       ('B004', 'Reebok', 1, 0),
       ('B005', 'Under Armour', 1, 0);

-- 6. Insert dữ liệu vào bảng cart
INSERT INTO [dbo].[cart] ([account_id], [code_cart], [create_by], [create_at], [update_by], [update_at], [status_cart], [deleted])
VALUES (1, 'CART001', 'admin', '2024-11-01', 'admin', '2024-11-01', 1, 0),
       (2, 'CART002', 'admin', '2024-11-02', 'admin', '2024-11-02', 1, 0),
       (3, 'CART003', 'admin', '2024-11-03', 'admin', '2024-11-03', 1, 0),
       (4, 'CART004', 'admin', '2024-11-04', 'admin', '2024-11-04', 1, 0),
       (5, 'CART005', 'admin', '2024-11-05', 'admin', '2024-11-05', 1, 0);
-- 1. Insert data into cart_detail
INSERT INTO [dbo].[cart_detail] ([shirt_detail_id], [cart_id], [code_cart_detail], [quantity], [status_cart_detail], [deleted])
VALUES (1, 1, 'CD001', 2, 1, 0),
       (2, 1, 'CD002', 1, 1, 0),
       (3, 2, 'CD003', 4, 1, 0),
       (4, 3, 'CD004', 3, 1, 0),
       (5, 4, 'CD005', 5, 1, 0);

-- 2. Insert data into category
INSERT INTO [dbo].[category] ([code_category], [name_category], [status_category], [deleted])
VALUES ('C001', 'Men', 1, 0),
       ('C002', 'Women', 1, 0),
       ('C003', 'Kids', 1, 0),
       ('C004', 'Accessories', 1, 0),
       ('C005', 'Footwear', 1, 0);

-- 3. Insert data into color
INSERT INTO [dbo].[color] ([code_color], [name_color], [status_color], [deleted])
VALUES ('CL001', 'Red', 1, 0),
       ('CL002', 'Blue', 1, 0),
       ('CL003', 'Green', 1, 0),
       ('CL004', 'Black', 1, 0),
       ('CL005', 'White', 1, 0);

-- 4. Insert data into gender
INSERT INTO [dbo].[gender] ([code_gender], [name_gender], [status_gender], [deleted])
VALUES ('G001', 'Male', 1, 0),
       ('G002', 'Female', 1, 0),
       ('G003', 'Unisex', 1, 0),
       ('G004', 'Kids', 1, 0),
       ('G005', 'All', 1, 0);

-- 5. Insert data into image_shirt_detail
INSERT INTO [dbo].[image_shirt_detail] ([shirt_detail_id], [code_image], [name_image], [main_image], [deleted])
VALUES (1, 'IMG001', 'Shirt Image 1', 1, 0),
       (2, 'IMG002', 'Shirt Image 2', 1, 0),
       (3, 'IMG003', 'Shirt Image 3', 0, 0),
       (4, 'IMG004', 'Shirt Image 4', 1, 0),
       (5, 'IMG005', 'Shirt Image 5', 0, 0);

-- 6. Insert data into material
INSERT INTO [dbo].[material] ([code_material], [name_material], [status_material], [deleted])
VALUES ('M001', 'Cotton', 1, 0),
       ('M002', 'Polyester', 1, 0),
       ('M003', 'Wool', 1, 0),
       ('M004', 'Leather', 1, 0),
       ('M005', 'Silk', 1, 0);

-- 7. Insert data into origin
INSERT INTO [dbo].[origin] ([code_origin], [name_origin], [status_origin], [deleted])
VALUES ('O001', 'USA', 1, 0),
       ('O002', 'China', 1, 0),
       ('O003', 'India', 1, 0),
       ('O004', 'Vietnam', 1, 0),
       ('O005', 'Italy', 1, 0);

-- 8. Insert data into pattern
INSERT INTO [dbo].[pattern] ([code_pattern], [name_pattern], [status_pattern], [deleted])
VALUES ('P001', 'Solid', 1, 0),
       ('P002', 'Striped', 1, 0),
       ('P003', 'Checked', 1, 0),
       ('P004', 'Printed', 1, 0),
       ('P005', 'Polka Dot', 1, 0);

-- 9. Insert data into account
INSERT INTO [dbo].[account] ([code_account], [username], [pass], [first_name], [last_name], [avatar], [address_account], [phone_number], [email], [status_account], [create_by], [create_at], [update_by], [update_at], [deleted])
VALUES ('A001', 'user1', 'password1', 'John', 'Doe', 'avatar1.jpg', '123 Main St', '123-456-7890', 'john.doe@example.com', 1, 'admin', '2024-11-01', 'admin', '2024-11-01', 0),
       ('A002', 'user2', 'password2', 'Jane', 'Smith', 'avatar2.jpg', '456 Oak St', '234-567-8901', 'jane.smith@example.com', 1, 'admin', '2024-11-01', 'admin', '2024-11-01', 0),
       ('A003', 'user3', 'password3', 'Sam', 'Wilson', 'avatar3.jpg', '789 Pine St', '345-678-9012', 'sam.wilson@example.com', 1, 'admin', '2024-11-01', 'admin', '2024-11-01', 0),
       ('A004', 'user4', 'password4', 'Laura', 'Brown', 'avatar4.jpg', '101 Maple St', '456-789-0123', 'laura.brown@example.com', 1, 'admin', '2024-11-01', 'admin', '2024-11-01', 0),
       ('A005', 'user5', 'password5', 'Tom', 'Davis', 'avatar5.jpg', '202 Birch St', '567-890-1234', 'tom.davis@example.com', 1, 'admin', '2024-11-01', 'admin', '2024-11-01', 0);
-- 1. Insert dữ liệu vào bảng payment_method
INSERT INTO [dbo].[payment_method] ([code_paymentmethod], [name_paymentmethod], [status_paymentmethod], [note], [deleted])
VALUES 
('PM001', 'Credit Card', 1, 'Payment via Credit Card', 0),
('PM002', 'PayPal', 1, 'Payment via PayPal', 0),
('PM003', 'Bank Transfer', 0, 'Payment via Bank Transfer', 0),
('PM004', 'Cash on Delivery', 1, 'Payment on Delivery', 0),
('PM005', 'Google Pay', 1, 'Payment via Google Pay', 0);

-- 2. Insert dữ liệu vào bảng role_A
INSERT INTO [dbo].[role_A] ([code_role], [name_role], [status_role], [description_role], [create_by], [create_at], [update_by], [update_at], [deleted])
VALUES 
('R001', 'Admin', 1, 'Administrator role with full access', 'System', '2024-01-01', 'System', '2024-01-01', 0),
('R002', 'User', 1, 'Regular user role with limited access', 'System', '2024-01-01', 'System', '2024-01-01', 0),
('R003', 'Manager', 1, 'Manager role with management access', 'System', '2024-01-01', 'System', '2024-01-01', 0),
('R004', 'Guest', 1, 'Guest role with viewing access', 'System', '2024-01-01', 'System', '2024-01-01', 0),
('R005', 'Support', 0, 'Support role with access to customer support tools', 'System', '2024-01-01', 'System', '2024-01-01', 0);

-- 3. Insert dữ liệu vào bảng season
INSERT INTO [dbo].[season] ([code_season], [name_season], [status_season], [deleted])
VALUES 
('S001', 'Spring', 1, 0),
('S002', 'Summer', 1, 0),
('S003', 'Autumn', 1, 0),
('S004', 'Winter', 1, 0),
('S005', 'Holiday Collection', 0, 0);

-- 4. Insert dữ liệu vào bảng shirt
INSERT INTO [dbo].[shirt] ([brand_id], [category_id], [code_shirt], [name_shirt], [create_by], [create_at], [update_by], [update_at], [status_shirt], [deleted])
VALUES 
(1, 1, 'S001', 'Basic T-Shirt', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 1, 0),
(2, 2, 'S002', 'Graphic T-Shirt', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 1, 0),
(3, 3, 'S003', 'Polo Shirt', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0, 0),
(4, 1, 'S004', 'Casual Shirt', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 1, 0),
(5, 2, 'S005', 'Sports T-Shirt', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 1, 0);

-- 5. Insert dữ liệu vào bảng shirt_detail
INSERT INTO [dbo].[shirt_detail] ([shirt_id], [pattern_id], [gender_id], [origin_id], [season_id], [size_id], [material_id], [color_id], [code_shirt_detail], [price], [quantity], [status_shirt_detail], [create_by], [create_at], [update_by], [update_at], [deleted])
VALUES 
(1, 1, 1, 1, 1, 1, 1, 1, 'SD001', 19.99, 100, 1, 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
(2, 2, 2, 1, 2, 2, 2, 2, 'SD002', 25.99, 150, 1, 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
(3, 3, 1, 2, 3, 3, 1, 3, 'SD003', 29.99, 200, 0, 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
(4, 1, 2, 1, 4, 4, 2, 4, 'SD004', 18.99, 120, 1, 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
(5, 2, 1, 2, 5, 5, 3, 5, 'SD005', 22.99, 130, 1, 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0);

-- 6. Insert dữ liệu vào bảng size
INSERT INTO [dbo].[size] ([code_size], [name_size], [status_size], [deleted])
VALUES 
('S', 'Small', 1, 0),
('M', 'Medium', 1, 0),
('L', 'Large', 1, 0),
('XL', 'Extra Large', 1, 0),
('XXL', 'Double Extra Large', 0, 0);

-- 7. Insert dữ liệu vào bảng voucher
INSERT INTO [dbo].[voucher] ([code_voucher], [type_voucher], [name_voucher], [discount_value], [quantity], [min_bill_value], [maximum_discount], [startdate], [enddate], [status_voucher], [description_voucher], [create_by], [create_at], [update_by], [update_at], [deleted])
VALUES 
('V001', 'Percentage', '10% Off', 10.00, 100, 50.00, 20.00, '2024-01-01', '2024-12-31', 1, 'Discount of 10% on orders over $50', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
('V002', 'Cash', 'Flat $5 Off', 5.00, 200, 30.00, 10.00, '2024-01-01', '2024-12-31', 1, 'Flat $5 discount on orders over $30', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
('V003', 'Percentage', '15% Off', 15.00, 150, 100.00, 30.00, '2024-01-01', '2024-12-31', 0, 'Discount of 15% on orders over $100', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
('V004', 'Cash', 'Flat $10 Off', 10.00, 50, 75.00, 20.00, '2024-01-01', '2024-12-31', 1, 'Flat $10 discount on orders over $75', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0),
('V005', 'Percentage', '5% Off', 5.00, 300, 20.00, 5.00, '2024-01-01', '2024-12-31', 1, 'Discount of 5% on orders over $20', 'Admin', '2024-01-01', 'Admin', '2024-01-01', 0);
