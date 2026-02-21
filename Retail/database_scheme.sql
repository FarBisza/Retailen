USE [RETAILEN]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Attribute]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Attribute](
	[AttributeID] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](60) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[DataType] [nvarchar](50) NOT NULL,
	[Unit] [nvarchar](20) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Attribute] PRIMARY KEY CLUSTERED 
(
	[AttributeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Attribute_Code] UNIQUE NONCLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AttributeColor]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AttributeColor](
	[ColorID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_AttributeColor] PRIMARY KEY CLUSTERED 
(
	[ColorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_AttributeColor_Name] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AttributeMaterial]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AttributeMaterial](
	[MaterialID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_AttributeMaterial] PRIMARY KEY CLUSTERED 
(
	[MaterialID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_AttributeMaterial_Name] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AttributeSize]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AttributeSize](
	[SizeID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_AttributeSize] PRIMARY KEY CLUSTERED 
(
	[SizeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_AttributeSize_Name] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Cart]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cart](
	[CartID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NULL,
	[SessionID] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NULL,
	[CreatedAt] [datetime2](7) NULL,
	[UpdatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Cart] PRIMARY KEY CLUSTERED 
(
	[CartID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CartItem]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CartItem](
	[CartItemID] [int] IDENTITY(1,1) NOT NULL,
	[CartID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[AddedAt] [datetime2](7) NULL,
 CONSTRAINT [PK_CartItem] PRIMARY KEY CLUSTERED 
(
	[CartItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[CategoryID] [int] IDENTITY(1,1) NOT NULL,
	[ParentID] [int] NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoryAttribute]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoryAttribute](
	[CategoryID] [int] NOT NULL,
	[AttributeID] [int] NOT NULL,
	[IsRequired] [bit] NOT NULL,
	[SortOrder] [int] NOT NULL,
 CONSTRAINT [PK_CategoryAttribute] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC,
	[AttributeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoryLeaf]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoryLeaf](
	[CategoryID] [int] NOT NULL,
 CONSTRAINT [PK_CategoryLeaf] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customer]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[CustomerID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Phone] [nvarchar](50) NULL,
	[Address] [nvarchar](255) NULL,
	[City] [nvarchar](100) NULL,
	[ZipCode] [nvarchar](20) NULL,
	[Country] [nvarchar](100) NULL,
	[RoleID] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[EmailConfirmationToken] [nvarchar](256) NULL,
	[CreatedAt] [datetime2](7) NULL,
	[UpdatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[CustomerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Customer_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GoodsReceipt]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GoodsReceipt](
	[GoodsReceiptID] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderID] [int] NOT NULL,
	[WarehouseID] [int] NULL,
	[DocumentNumber] [nvarchar](60) NULL,
	[ReceivedDate] [datetime2](7) NOT NULL,
	[ShippingCost] [decimal](18, 4) NULL,
	[Comment] [nvarchar](250) NULL,
 CONSTRAINT [PK_GoodsReceipt] PRIMARY KEY CLUSTERED 
(
	[GoodsReceiptID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GoodsReceiptDiscrepancy]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GoodsReceiptDiscrepancy](
	[DiscrepancyID] [int] IDENTITY(1,1) NOT NULL,
	[GoodsReceiptID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Type] [nvarchar](40) NOT NULL,
	[Quantity] [int] NOT NULL,
	[Description] [nvarchar](250) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_GoodsReceiptDiscrepancy] PRIMARY KEY CLUSTERED 
(
	[DiscrepancyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GoodsReceiptItem]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GoodsReceiptItem](
	[GoodsReceiptItemID] [int] IDENTITY(1,1) NOT NULL,
	[GoodsReceiptID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[QuantityReceived] [int] NOT NULL,
	[QuantityDamaged] [int] NOT NULL,
 CONSTRAINT [PK_GoodsReceiptItem] PRIMARY KEY CLUSTERED 
(
	[GoodsReceiptItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Inventory]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Inventory](
	[ProductID] [int] NOT NULL,
	[WarehouseID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Inventory] PRIMARY KEY CLUSTERED 
(
	[ProductID] ASC,
	[WarehouseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InventoryHistory]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InventoryHistory](
	[HistoryID] [bigint] IDENTITY(1,1) NOT NULL,
	[ProductID] [int] NOT NULL,
	[WarehouseID] [int] NULL,
	[OrderID] [int] NULL,
	[EventType] [nvarchar](40) NOT NULL,
	[QuantityChange] [int] NOT NULL,
	[QuantityBefore] [int] NULL,
	[QuantityAfter] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_InventoryHistory] PRIMARY KEY CLUSTERED 
(
	[HistoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Invoice]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Invoice](
	[InvoiceID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[InvoiceStatusID] [int] NULL,
	[IssuedDate] [datetime2](7) NULL,
	[Amount] [decimal](12, 2) NULL,
 CONSTRAINT [PK_Invoice] PRIMARY KEY CLUSTERED 
(
	[InvoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InvoiceStatus]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InvoiceStatus](
	[InvoiceStatusID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_InvoiceStatus] PRIMARY KEY CLUSTERED 
(
	[InvoiceStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order](
	[OrderID] [int] IDENTITY(1,1) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[OrderStatusID] [int] NULL,
	[OrderDate] [datetime2](7) NULL,
	[TotalAmount] [decimal](12, 2) NULL,
 CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED 
(
	[OrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderBillingInfo]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderBillingInfo](
	[OrderID] [int] NOT NULL,
	[BuyerName] [nvarchar](200) NOT NULL,
	[TaxID] [nvarchar](20) NOT NULL,
	[Address] [nvarchar](255) NOT NULL,
	[City] [nvarchar](100) NOT NULL,
	[ZipCode] [nvarchar](20) NOT NULL,
	[Country] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](255) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_OrderBillingInfo] PRIMARY KEY CLUSTERED 
(
	[OrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderItem]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderItem](
	[OrderItemID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](10, 2) NOT NULL,
 CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED 
(
	[OrderItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderShippingAddress]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderShippingAddress](
	[OrderID] [int] NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[FullName] [nvarchar](200) NOT NULL,
	[PhoneNumber] [nvarchar](50) NULL,
	[StreetAddress] [nvarchar](255) NOT NULL,
	[Apartment] [nvarchar](100) NULL,
	[City] [nvarchar](100) NOT NULL,
	[State] [nvarchar](100) NOT NULL,
	[ZipCode] [nvarchar](20) NOT NULL,
	[Country] [nvarchar](100) NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_OrderShippingAddress] PRIMARY KEY CLUSTERED 
(
	[OrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderStatus]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderStatus](
	[OrderStatusID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_OrderStatus] PRIMARY KEY CLUSTERED 
(
	[OrderStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderStatusHistory]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderStatusHistory](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[OrderStatusID] [int] NOT NULL,
	[ChangedAt] [datetime2](7) NOT NULL,
	[Comment] [nvarchar](250) NULL,
 CONSTRAINT [PK_OrderStatusHistory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[PaymentID] [int] IDENTITY(1,1) NOT NULL,
	[InvoiceID] [int] NULL,
	[OrderID] [int] NULL,
	[PaymentTypeID] [int] NOT NULL,
	[Amount] [decimal](12, 2) NOT NULL,
	[PaymentDate] [datetime2](7) NULL,
 CONSTRAINT [PK_Payment] PRIMARY KEY CLUSTERED 
(
	[PaymentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentType]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentType](
	[PaymentTypeID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_PaymentType] PRIMARY KEY CLUSTERED 
(
	[PaymentTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[ProductID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](1000) NULL,
	[Price] [decimal](10, 2) NOT NULL,
	[IsActive] [bit] NULL,
	[ImageUrl] [nvarchar](500) NULL,
	[CreatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[ProductID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductAttribute]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductAttribute](
	[ValueID] [bigint] IDENTITY(1,1) NOT NULL,
	[ProductID] [int] NOT NULL,
	[AttributeID] [int] NOT NULL,
	[ValueString] [nvarchar](450) NULL,
	[ValueInt] [int] NULL,
	[ValueDecimal] [decimal](18, 4) NULL,
	[ValueDate] [datetime2](7) NULL,
	[ValueBool] [bit] NULL,
	[ValueColorID] [int] NULL,
	[ValueMaterialID] [int] NULL,
	[ValueSizeID] [int] NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_ProductAttribute] PRIMARY KEY CLUSTERED 
(
	[ValueID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_ProductAttribute] UNIQUE NONCLUSTERED 
(
	[ProductID] ASC,
	[AttributeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductCategory]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductCategory](
	[ProductID] [int] NOT NULL,
	[CategoryID] [int] NOT NULL,
 CONSTRAINT [PK_ProductCategory] PRIMARY KEY CLUSTERED 
(
	[ProductID] ASC,
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrder]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrder](
	[PurchaseOrderID] [int] IDENTITY(1,1) NOT NULL,
	[SupplierID] [int] NOT NULL,
	[WarehouseID] [int] NULL,
	[StatusID] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[ExpectedDate] [datetime2](7) NULL,
	[Comment] [nvarchar](250) NULL,
 CONSTRAINT [PK_PurchaseOrder] PRIMARY KEY CLUSTERED 
(
	[PurchaseOrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrderItem]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrderItem](
	[PurchaseOrderItemID] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderID] [int] NOT NULL,
	[ProductID] [int] NOT NULL,
	[QuantityOrdered] [int] NOT NULL,
	[PurchasePrice] [decimal](18, 4) NULL,
 CONSTRAINT [PK_PurchaseOrderItem] PRIMARY KEY CLUSTERED 
(
	[PurchaseOrderItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrderStatus]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrderStatus](
	[StatusID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](60) NOT NULL,
	[Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_PurchaseOrderStatus] PRIMARY KEY CLUSTERED 
(
	[StatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RefreshToken]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RefreshToken](
	[Id] [uniqueidentifier] NOT NULL,
	[Token] [nvarchar](500) NOT NULL,
	[CustomerID] [int] NOT NULL,
	[Expires] [datetime2](7) NOT NULL,
	[CreatedByIp] [nvarchar](max) NOT NULL,
	[Revoked] [datetime2](7) NULL,
	[RevokedByIp] [nvarchar](max) NULL,
	[ReplacedByToken] [nvarchar](max) NULL,
	[ReasonRevoked] [nvarchar](max) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_RefreshToken] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Return]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Return](
	[ReturnID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[CustomerID] [int] NOT NULL,
	[ReturnStatusID] [int] NOT NULL,
	[OrderItemID] [int] NULL,
	[Quantity] [int] NOT NULL,
	[Reason] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[RefundAmount] [decimal](12, 2) NOT NULL,
	[ApprovedDate] [datetime2](7) NULL,
	[ReturnDate] [datetime2](7) NULL,
	[AdminNote] [nvarchar](500) NULL,
	[CreatedAt] [datetime2](7) NULL,
	[UpdatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Return] PRIMARY KEY CLUSTERED 
(
	[ReturnID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReturnStatus]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReturnStatus](
	[ReturnStatusID] [int] NOT NULL,
	[Name] [nvarchar](60) NOT NULL,
	[Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_ReturnStatus] PRIMARY KEY CLUSTERED 
(
	[ReturnStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Review]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Review](
	[ReviewID] [int] IDENTITY(1,1) NOT NULL,
	[ProductID] [int] NOT NULL,
	[CustomerID] [int] NULL,
	[OrderItemID] [int] NULL,
	[Rating] [tinyint] NOT NULL,
	[Title] [nvarchar](200) NULL,
	[Content] [nvarchar](max) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[ModerationStatus] [nvarchar](30) NOT NULL,
 CONSTRAINT [PK_Review] PRIMARY KEY CLUSTERED 
(
	[ReviewID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[RoleID] [int] NOT NULL,
	[RoleName] [varchar](50) NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shipment]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shipment](
	[ShipmentID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [int] NOT NULL,
	[WarehouseID] [int] NOT NULL,
	[Carrier] [nvarchar](100) NULL,
	[ServiceLevel] [nvarchar](100) NULL,
	[TrackingNumber] [nvarchar](100) NULL,
	[ShipmentStatusID] [int] NULL,
	[ShippedDate] [datetime2](7) NULL,
	[DeliveredDate] [datetime2](7) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_Shipment] PRIMARY KEY CLUSTERED 
(
	[ShipmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShipmentItem]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShipmentItem](
	[ShipmentID] [int] NOT NULL,
	[OrderItemID] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
 CONSTRAINT [PK_ShipmentItem] PRIMARY KEY CLUSTERED 
(
	[ShipmentID] ASC,
	[OrderItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShipmentStatus]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShipmentStatus](
	[ShipmentStatusID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](60) NOT NULL,
	[Description] [nvarchar](255) NULL,
 CONSTRAINT [PK_ShipmentStatus] PRIMARY KEY CLUSTERED 
(
	[ShipmentStatusID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShipmentStatusHistory]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShipmentStatusHistory](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[ShipmentID] [int] NOT NULL,
	[ShipmentStatusID] [int] NOT NULL,
	[ChangedAt] [datetime2](7) NOT NULL,
	[Comment] [nvarchar](250) NULL,
 CONSTRAINT [PK_ShipmentStatusHistory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Supplier]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Supplier](
	[SupplierID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Email] [nvarchar](255) NULL,
	[Phone] [nvarchar](50) NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Supplier] PRIMARY KEY CLUSTERED 
(
	[SupplierID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Warehouse]    Script Date: 10.02.2026 04:39:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Warehouse](
	[WarehouseID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Latitude] [decimal](9, 6) NULL,
	[Longitude] [decimal](9, 6) NULL,
	[IsActive] [bit] NOT NULL,
 CONSTRAINT [PK_Warehouse] PRIMARY KEY CLUSTERED 
(
	[WarehouseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Attribute] ADD  CONSTRAINT [DF_Attribute_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Cart] ADD  CONSTRAINT [DF_Cart_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Cart] ADD  CONSTRAINT [DF_Cart_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Cart] ADD  CONSTRAINT [DF_Cart_UpdatedAt]  DEFAULT (sysdatetime()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[CartItem] ADD  CONSTRAINT [DF_CI_AddedAt]  DEFAULT (sysdatetime()) FOR [AddedAt]
GO
ALTER TABLE [dbo].[CategoryAttribute] ADD  CONSTRAINT [DF_CA_IsRequired]  DEFAULT ((0)) FOR [IsRequired]
GO
ALTER TABLE [dbo].[CategoryAttribute] ADD  CONSTRAINT [DF_CA_SortOrder]  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[Customer] ADD  CONSTRAINT [DF_Customer_RoleID]  DEFAULT ((2)) FOR [RoleID]
GO
ALTER TABLE [dbo].[Customer] ADD  CONSTRAINT [DF_Customer_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Customer] ADD  CONSTRAINT [DF_Customer_EmailConfirmed]  DEFAULT ((0)) FOR [EmailConfirmed]
GO
ALTER TABLE [dbo].[Customer] ADD  CONSTRAINT [DF_Customer_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Customer] ADD  CONSTRAINT [DF_Customer_UpdatedAt]  DEFAULT (sysdatetime()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[GoodsReceipt] ADD  CONSTRAINT [DF_GR_ReceivedDate]  DEFAULT (sysdatetime()) FOR [ReceivedDate]
GO
ALTER TABLE [dbo].[GoodsReceiptDiscrepancy] ADD  CONSTRAINT [DF_GRD_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[GoodsReceiptItem] ADD  CONSTRAINT [DF_GRI_QtyDamaged]  DEFAULT ((0)) FOR [QuantityDamaged]
GO
ALTER TABLE [dbo].[Inventory] ADD  CONSTRAINT [DF_Inventory_Quantity]  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Inventory] ADD  CONSTRAINT [DF_Inventory_UpdatedAt]  DEFAULT (sysdatetime()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[InventoryHistory] ADD  CONSTRAINT [DF_IH_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Invoice] ADD  CONSTRAINT [DF_Invoice_Status]  DEFAULT ((1)) FOR [InvoiceStatusID]
GO
ALTER TABLE [dbo].[Invoice] ADD  CONSTRAINT [DF_Invoice_Date]  DEFAULT (sysdatetime()) FOR [IssuedDate]
GO
ALTER TABLE [dbo].[Order] ADD  CONSTRAINT [DF_Order_Status]  DEFAULT ((1)) FOR [OrderStatusID]
GO
ALTER TABLE [dbo].[Order] ADD  CONSTRAINT [DF_Order_Date]  DEFAULT (sysdatetime()) FOR [OrderDate]
GO
ALTER TABLE [dbo].[OrderBillingInfo] ADD  CONSTRAINT [DF_OBI_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[OrderShippingAddress] ADD  CONSTRAINT [DF_OSA_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[OrderStatusHistory] ADD  CONSTRAINT [DF_OSH_ChangedAt]  DEFAULT (sysdatetime()) FOR [ChangedAt]
GO
ALTER TABLE [dbo].[Payment] ADD  CONSTRAINT [DF_Payment_Date]  DEFAULT (sysdatetime()) FOR [PaymentDate]
GO
ALTER TABLE [dbo].[Product] ADD  CONSTRAINT [DF_Product_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Product] ADD  CONSTRAINT [DF_Product_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[ProductAttribute] ADD  CONSTRAINT [DF_PA_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[PurchaseOrder] ADD  CONSTRAINT [DF_PO_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Return] ADD  CONSTRAINT [DF_Return_Status]  DEFAULT ((1)) FOR [ReturnStatusID]
GO
ALTER TABLE [dbo].[Return] ADD  CONSTRAINT [DF_Return_Quantity]  DEFAULT ((1)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Review] ADD  CONSTRAINT [DF_Review_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Review] ADD  CONSTRAINT [DF_Review_Status]  DEFAULT ('approved') FOR [ModerationStatus]
GO
ALTER TABLE [dbo].[Shipment] ADD  CONSTRAINT [DF_Shipment_CreatedAt]  DEFAULT (sysdatetime()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[ShipmentStatusHistory] ADD  CONSTRAINT [DF_SSH_ChangedAt]  DEFAULT (sysdatetime()) FOR [ChangedAt]
GO
ALTER TABLE [dbo].[Supplier] ADD  CONSTRAINT [DF_Supplier_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Warehouse] ADD  CONSTRAINT [DF_Warehouse_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Cart]  WITH CHECK ADD  CONSTRAINT [FK_Cart_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Cart] CHECK CONSTRAINT [FK_Cart_Customer]
GO
ALTER TABLE [dbo].[CartItem]  WITH CHECK ADD  CONSTRAINT [FK_CI_Cart] FOREIGN KEY([CartID])
REFERENCES [dbo].[Cart] ([CartID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CartItem] CHECK CONSTRAINT [FK_CI_Cart]
GO
ALTER TABLE [dbo].[CartItem]  WITH CHECK ADD  CONSTRAINT [FK_CI_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
GO
ALTER TABLE [dbo].[CartItem] CHECK CONSTRAINT [FK_CI_Product]
GO
ALTER TABLE [dbo].[Category]  WITH CHECK ADD  CONSTRAINT [FK_Category_Parent] FOREIGN KEY([ParentID])
REFERENCES [dbo].[Category] ([CategoryID])
GO
ALTER TABLE [dbo].[Category] CHECK CONSTRAINT [FK_Category_Parent]
GO
ALTER TABLE [dbo].[CategoryAttribute]  WITH CHECK ADD  CONSTRAINT [FK_CA_Attribute] FOREIGN KEY([AttributeID])
REFERENCES [dbo].[Attribute] ([AttributeID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CategoryAttribute] CHECK CONSTRAINT [FK_CA_Attribute]
GO
ALTER TABLE [dbo].[CategoryAttribute]  WITH CHECK ADD  CONSTRAINT [FK_CA_Category] FOREIGN KEY([CategoryID])
REFERENCES [dbo].[Category] ([CategoryID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CategoryAttribute] CHECK CONSTRAINT [FK_CA_Category]
GO
ALTER TABLE [dbo].[CategoryLeaf]  WITH CHECK ADD  CONSTRAINT [FK_CategoryLeaf_Category] FOREIGN KEY([CategoryID])
REFERENCES [dbo].[Category] ([CategoryID])
GO
ALTER TABLE [dbo].[CategoryLeaf] CHECK CONSTRAINT [FK_CategoryLeaf_Category]
GO
ALTER TABLE [dbo].[Customer]  WITH CHECK ADD  CONSTRAINT [FK_Customer_Role] FOREIGN KEY([RoleID])
REFERENCES [dbo].[Role] ([RoleID])
GO
ALTER TABLE [dbo].[Customer] CHECK CONSTRAINT [FK_Customer_Role]
GO
ALTER TABLE [dbo].[GoodsReceipt]  WITH CHECK ADD  CONSTRAINT [FK_GR_PurchaseOrder] FOREIGN KEY([PurchaseOrderID])
REFERENCES [dbo].[PurchaseOrder] ([PurchaseOrderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GoodsReceipt] CHECK CONSTRAINT [FK_GR_PurchaseOrder]
GO
ALTER TABLE [dbo].[GoodsReceipt]  WITH CHECK ADD  CONSTRAINT [FK_GR_Warehouse] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouse] ([WarehouseID])
GO
ALTER TABLE [dbo].[GoodsReceipt] CHECK CONSTRAINT [FK_GR_Warehouse]
GO
ALTER TABLE [dbo].[GoodsReceiptDiscrepancy]  WITH CHECK ADD  CONSTRAINT [FK_GRD_GoodsReceipt] FOREIGN KEY([GoodsReceiptID])
REFERENCES [dbo].[GoodsReceipt] ([GoodsReceiptID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GoodsReceiptDiscrepancy] CHECK CONSTRAINT [FK_GRD_GoodsReceipt]
GO
ALTER TABLE [dbo].[GoodsReceiptDiscrepancy]  WITH CHECK ADD  CONSTRAINT [FK_GRD_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
GO
ALTER TABLE [dbo].[GoodsReceiptDiscrepancy] CHECK CONSTRAINT [FK_GRD_Product]
GO
ALTER TABLE [dbo].[GoodsReceiptItem]  WITH CHECK ADD  CONSTRAINT [FK_GRI_GoodsReceipt] FOREIGN KEY([GoodsReceiptID])
REFERENCES [dbo].[GoodsReceipt] ([GoodsReceiptID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[GoodsReceiptItem] CHECK CONSTRAINT [FK_GRI_GoodsReceipt]
GO
ALTER TABLE [dbo].[GoodsReceiptItem]  WITH CHECK ADD  CONSTRAINT [FK_GRI_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
GO
ALTER TABLE [dbo].[GoodsReceiptItem] CHECK CONSTRAINT [FK_GRI_Product]
GO
ALTER TABLE [dbo].[Inventory]  WITH CHECK ADD  CONSTRAINT [FK_Inventory_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Inventory] CHECK CONSTRAINT [FK_Inventory_Product]
GO
ALTER TABLE [dbo].[Inventory]  WITH CHECK ADD  CONSTRAINT [FK_Inventory_Warehouse] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouse] ([WarehouseID])
GO
ALTER TABLE [dbo].[Inventory] CHECK CONSTRAINT [FK_Inventory_Warehouse]
GO
ALTER TABLE [dbo].[InventoryHistory]  WITH CHECK ADD  CONSTRAINT [FK_IH_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[InventoryHistory] CHECK CONSTRAINT [FK_IH_Order]
GO
ALTER TABLE [dbo].[InventoryHistory]  WITH CHECK ADD  CONSTRAINT [FK_IH_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
GO
ALTER TABLE [dbo].[InventoryHistory] CHECK CONSTRAINT [FK_IH_Product]
GO
ALTER TABLE [dbo].[InventoryHistory]  WITH CHECK ADD  CONSTRAINT [FK_IH_Warehouse] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouse] ([WarehouseID])
GO
ALTER TABLE [dbo].[InventoryHistory] CHECK CONSTRAINT [FK_IH_Warehouse]
GO
ALTER TABLE [dbo].[Invoice]  WITH CHECK ADD  CONSTRAINT [FK_Invoice_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
GO
ALTER TABLE [dbo].[Invoice] CHECK CONSTRAINT [FK_Invoice_Order]
GO
ALTER TABLE [dbo].[Invoice]  WITH CHECK ADD  CONSTRAINT [FK_Invoice_Status] FOREIGN KEY([InvoiceStatusID])
REFERENCES [dbo].[InvoiceStatus] ([InvoiceStatusID])
GO
ALTER TABLE [dbo].[Invoice] CHECK CONSTRAINT [FK_Invoice_Status]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_Customer]
GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_Status] FOREIGN KEY([OrderStatusID])
REFERENCES [dbo].[OrderStatus] ([OrderStatusID])
GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_Status]
GO
ALTER TABLE [dbo].[OrderBillingInfo]  WITH CHECK ADD  CONSTRAINT [FK_OBI_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderBillingInfo] CHECK CONSTRAINT [FK_OBI_Order]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OI_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OI_Order]
GO
ALTER TABLE [dbo].[OrderItem]  WITH CHECK ADD  CONSTRAINT [FK_OI_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
GO
ALTER TABLE [dbo].[OrderItem] CHECK CONSTRAINT [FK_OI_Product]
GO
ALTER TABLE [dbo].[OrderShippingAddress]  WITH CHECK ADD  CONSTRAINT [FK_OSA_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderShippingAddress] CHECK CONSTRAINT [FK_OSA_Order]
GO
ALTER TABLE [dbo].[OrderStatusHistory]  WITH CHECK ADD  CONSTRAINT [FK_OSH_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[OrderStatusHistory] CHECK CONSTRAINT [FK_OSH_Order]
GO
ALTER TABLE [dbo].[OrderStatusHistory]  WITH CHECK ADD  CONSTRAINT [FK_OSH_Status] FOREIGN KEY([OrderStatusID])
REFERENCES [dbo].[OrderStatus] ([OrderStatusID])
GO
ALTER TABLE [dbo].[OrderStatusHistory] CHECK CONSTRAINT [FK_OSH_Status]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Invoice] FOREIGN KEY([InvoiceID])
REFERENCES [dbo].[Invoice] ([InvoiceID])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Invoice]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Order]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Type] FOREIGN KEY([PaymentTypeID])
REFERENCES [dbo].[PaymentType] ([PaymentTypeID])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Type]
GO
ALTER TABLE [dbo].[ProductAttribute]  WITH CHECK ADD  CONSTRAINT [FK_PA_Attribute] FOREIGN KEY([AttributeID])
REFERENCES [dbo].[Attribute] ([AttributeID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductAttribute] CHECK CONSTRAINT [FK_PA_Attribute]
GO
ALTER TABLE [dbo].[ProductAttribute]  WITH CHECK ADD  CONSTRAINT [FK_PA_Color] FOREIGN KEY([ValueColorID])
REFERENCES [dbo].[AttributeColor] ([ColorID])
GO
ALTER TABLE [dbo].[ProductAttribute] CHECK CONSTRAINT [FK_PA_Color]
GO
ALTER TABLE [dbo].[ProductAttribute]  WITH CHECK ADD  CONSTRAINT [FK_PA_Material] FOREIGN KEY([ValueMaterialID])
REFERENCES [dbo].[AttributeMaterial] ([MaterialID])
GO
ALTER TABLE [dbo].[ProductAttribute] CHECK CONSTRAINT [FK_PA_Material]
GO
ALTER TABLE [dbo].[ProductAttribute]  WITH CHECK ADD  CONSTRAINT [FK_PA_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductAttribute] CHECK CONSTRAINT [FK_PA_Product]
GO
ALTER TABLE [dbo].[ProductAttribute]  WITH CHECK ADD  CONSTRAINT [FK_PA_Size] FOREIGN KEY([ValueSizeID])
REFERENCES [dbo].[AttributeSize] ([SizeID])
GO
ALTER TABLE [dbo].[ProductAttribute] CHECK CONSTRAINT [FK_PA_Size]
GO
ALTER TABLE [dbo].[ProductCategory]  WITH CHECK ADD  CONSTRAINT [FK_PC_Category] FOREIGN KEY([CategoryID])
REFERENCES [dbo].[Category] ([CategoryID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductCategory] CHECK CONSTRAINT [FK_PC_Category]
GO
ALTER TABLE [dbo].[ProductCategory]  WITH CHECK ADD  CONSTRAINT [FK_PC_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProductCategory] CHECK CONSTRAINT [FK_PC_Product]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PO_Status] FOREIGN KEY([StatusID])
REFERENCES [dbo].[PurchaseOrderStatus] ([StatusID])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PO_Status]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PO_Supplier] FOREIGN KEY([SupplierID])
REFERENCES [dbo].[Supplier] ([SupplierID])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PO_Supplier]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PO_Warehouse] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouse] ([WarehouseID])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PO_Warehouse]
GO
ALTER TABLE [dbo].[PurchaseOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_POI_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
GO
ALTER TABLE [dbo].[PurchaseOrderItem] CHECK CONSTRAINT [FK_POI_Product]
GO
ALTER TABLE [dbo].[PurchaseOrderItem]  WITH CHECK ADD  CONSTRAINT [FK_POI_PurchaseOrder] FOREIGN KEY([PurchaseOrderID])
REFERENCES [dbo].[PurchaseOrder] ([PurchaseOrderID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[PurchaseOrderItem] CHECK CONSTRAINT [FK_POI_PurchaseOrder]
GO
ALTER TABLE [dbo].[RefreshToken]  WITH CHECK ADD  CONSTRAINT [FK_RefreshToken_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[RefreshToken] CHECK CONSTRAINT [FK_RefreshToken_Customer]
GO
ALTER TABLE [dbo].[Return]  WITH CHECK ADD  CONSTRAINT [FK_Return_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Return] CHECK CONSTRAINT [FK_Return_Customer]
GO
ALTER TABLE [dbo].[Return]  WITH CHECK ADD  CONSTRAINT [FK_Return_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
GO
ALTER TABLE [dbo].[Return] CHECK CONSTRAINT [FK_Return_Order]
GO
ALTER TABLE [dbo].[Return]  WITH CHECK ADD  CONSTRAINT [FK_Return_Status] FOREIGN KEY([ReturnStatusID])
REFERENCES [dbo].[ReturnStatus] ([ReturnStatusID])
GO
ALTER TABLE [dbo].[Return] CHECK CONSTRAINT [FK_Return_Status]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_Customer] FOREIGN KEY([CustomerID])
REFERENCES [dbo].[Customer] ([CustomerID])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_Customer]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_OrderItem] FOREIGN KEY([OrderItemID])
REFERENCES [dbo].[OrderItem] ([OrderItemID])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_OrderItem]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_Product] FOREIGN KEY([ProductID])
REFERENCES [dbo].[Product] ([ProductID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_Product]
GO
ALTER TABLE [dbo].[Shipment]  WITH CHECK ADD  CONSTRAINT [FK_Shipment_Order] FOREIGN KEY([OrderID])
REFERENCES [dbo].[Order] ([OrderID])
GO
ALTER TABLE [dbo].[Shipment] CHECK CONSTRAINT [FK_Shipment_Order]
GO
ALTER TABLE [dbo].[Shipment]  WITH CHECK ADD  CONSTRAINT [FK_Shipment_Status] FOREIGN KEY([ShipmentStatusID])
REFERENCES [dbo].[ShipmentStatus] ([ShipmentStatusID])
GO
ALTER TABLE [dbo].[Shipment] CHECK CONSTRAINT [FK_Shipment_Status]
GO
ALTER TABLE [dbo].[Shipment]  WITH CHECK ADD  CONSTRAINT [FK_Shipment_Warehouse] FOREIGN KEY([WarehouseID])
REFERENCES [dbo].[Warehouse] ([WarehouseID])
GO
ALTER TABLE [dbo].[Shipment] CHECK CONSTRAINT [FK_Shipment_Warehouse]
GO
ALTER TABLE [dbo].[ShipmentItem]  WITH CHECK ADD  CONSTRAINT [FK_SI_OrderItem] FOREIGN KEY([OrderItemID])
REFERENCES [dbo].[OrderItem] ([OrderItemID])
GO
ALTER TABLE [dbo].[ShipmentItem] CHECK CONSTRAINT [FK_SI_OrderItem]
GO
ALTER TABLE [dbo].[ShipmentItem]  WITH CHECK ADD  CONSTRAINT [FK_SI_Shipment] FOREIGN KEY([ShipmentID])
REFERENCES [dbo].[Shipment] ([ShipmentID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ShipmentItem] CHECK CONSTRAINT [FK_SI_Shipment]
GO
ALTER TABLE [dbo].[ShipmentStatusHistory]  WITH CHECK ADD  CONSTRAINT [FK_SSH_Shipment] FOREIGN KEY([ShipmentID])
REFERENCES [dbo].[Shipment] ([ShipmentID])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ShipmentStatusHistory] CHECK CONSTRAINT [FK_SSH_Shipment]
GO
ALTER TABLE [dbo].[ShipmentStatusHistory]  WITH CHECK ADD  CONSTRAINT [FK_SSH_Status] FOREIGN KEY([ShipmentStatusID])
REFERENCES [dbo].[ShipmentStatus] ([ShipmentStatusID])
GO
ALTER TABLE [dbo].[ShipmentStatusHistory] CHECK CONSTRAINT [FK_SSH_Status]
GO
ALTER TABLE [dbo].[Attribute]  WITH CHECK ADD  CONSTRAINT [CK_Attribute_DataType] CHECK  (([DataType]='json' OR [DataType]='bool' OR [DataType]='date' OR [DataType]='decimal' OR [DataType]='int' OR [DataType]='string'))
GO
ALTER TABLE [dbo].[Attribute] CHECK CONSTRAINT [CK_Attribute_DataType]
GO
ALTER TABLE [dbo].[Inventory]  WITH CHECK ADD  CONSTRAINT [CK_Inventory_Quantity] CHECK  (([Quantity]>=(0)))
GO
ALTER TABLE [dbo].[Inventory] CHECK CONSTRAINT [CK_Inventory_Quantity]
GO
ALTER TABLE [dbo].[ProductAttribute]  WITH CHECK ADD  CONSTRAINT [CHK_OnlyOneValue] CHECK  (((((((((case when [ValueString] IS NOT NULL then (1) else (0) end+case when [ValueInt] IS NOT NULL then (1) else (0) end)+case when [ValueDecimal] IS NOT NULL then (1) else (0) end)+case when [ValueBool] IS NOT NULL then (1) else (0) end)+case when [ValueDate] IS NOT NULL then (1) else (0) end)+case when [ValueColorID] IS NOT NULL then (1) else (0) end)+case when [ValueMaterialID] IS NOT NULL then (1) else (0) end)+case when [ValueSizeID] IS NOT NULL then (1) else (0) end)=(1)))
GO
ALTER TABLE [dbo].[ProductAttribute] CHECK CONSTRAINT [CHK_OnlyOneValue]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [CK_Review_Rating] CHECK  (([Rating]>=(1) AND [Rating]<=(5)))
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [CK_Review_Rating]
GO
