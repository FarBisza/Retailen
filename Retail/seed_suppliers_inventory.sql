-- Seed Dostawcy (Suppliers) for Generate New PO functionality
-- Run this script to add sample suppliers to the database

USE [Retail]
GO

-- Seed Magazyny (Warehouses) first - needed for Inventory FK
IF NOT EXISTS (SELECT 1 FROM [dbo].[Magazyny])
BEGIN
    SET IDENTITY_INSERT [dbo].[Magazyny] ON;
    
    INSERT INTO [dbo].[Magazyny] ([MagazynID], [Nazwa], [Latitude], [Longitude], [Aktywny])
    VALUES 
        (1, N'Main Warehouse - Warsaw', 52.229676, 21.012229, 1),
        (2, N'Distribution Center - Krakow', 50.064650, 19.944981, 1),
        (3, N'Fulfillment Hub - Poznan', 52.406376, 16.925167, 1);
    
    SET IDENTITY_INSERT [dbo].[Magazyny] OFF;
    
    PRINT 'Successfully inserted 3 warehouses into Magazyny table.';
END
ELSE
BEGIN
    PRINT 'Warehouses already exist in Magazyny table. Skipping insert.';
END
GO

-- Check if suppliers already exist to avoid duplicates
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dostawcy])
BEGIN
    SET IDENTITY_INSERT [dbo].[Dostawcy] ON;
    
    INSERT INTO [dbo].[Dostawcy] ([DostawcaID], [Nazwa], [Email], [Telefon], [Aktywny])
    VALUES 
        (1, N'IKEA Business', N'business@ikea.com', N'+48 22 275 00 00', 1),
        (2, N'Home Depot Pro', N'pro@homedepot.com', N'+1 770-433-8211', 1),
        (3, N'Furniture Factory Direct', N'orders@furniturefactory.com', N'+48 12 345 67 89', 1),
        (4, N'Premium Wood Suppliers', N'sales@premiumwood.pl', N'+48 61 234 56 78', 1),
        (5, N'Global Textiles Co.', N'contact@globaltextiles.com', N'+48 71 123 45 67', 1);
    
    SET IDENTITY_INSERT [dbo].[Dostawcy] OFF;
    
    PRINT 'Successfully inserted 5 suppliers into Dostawcy table.';
END
ELSE
BEGIN
    PRINT 'Suppliers already exist in Dostawcy table. Skipping insert.';
END
GO

-- Seed inventory data for products
-- This ensures products have stock quantities (uses Warehouse ID 1)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Inventory])
BEGIN
    INSERT INTO [dbo].[Inventory] ([ProduktID], [MagazynID], [Ilosc], [UpdatedAt])
    SELECT TOP 100 
        p.ProduktID, 
        1, -- Main Warehouse ID
        ABS(CHECKSUM(NEWID()) % 100) + 10, -- Random qty between 10-109
        SYSDATETIME()
    FROM [dbo].[Produkty] p
    WHERE p.Aktywny = 1
    AND NOT EXISTS (SELECT 1 FROM [dbo].[Inventory] i WHERE i.ProduktID = p.ProduktID);
    
    PRINT 'Successfully seeded Inventory table with stock quantities.';
END
ELSE
BEGIN
    -- Update existing inventory with more stock if all are 0
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Inventory] WHERE Ilosc > 0)
    BEGIN
        UPDATE [dbo].[Inventory] 
        SET Ilosc = ABS(CHECKSUM(NEWID()) % 100) + 10, 
            UpdatedAt = SYSDATETIME();
        PRINT 'Updated Inventory with stock quantities.';
    END
    ELSE
    BEGIN
        PRINT 'Inventory data already exists with stock. Skipping insert.';
    END
END
GO

-- Verify the data
SELECT 'Warehouses:' AS Info;
SELECT * FROM [dbo].[Magazyny];
SELECT 'Suppliers:' AS Info;
SELECT * FROM [dbo].[Dostawcy];
SELECT 'Sample Inventory (Top 10):' AS Info;
SELECT TOP 10 i.*, p.Nazwa AS ProductName FROM [dbo].[Inventory] i JOIN [dbo].[Produkty] p ON i.ProduktID = p.ProduktID;
