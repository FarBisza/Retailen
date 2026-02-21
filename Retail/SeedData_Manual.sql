-- Script to populate Kategorie_Atrybuty and new Produkt_Atrybuty manually
-- Run this in SQL Server Management Studio or via a tool if Migration is not an option

USE [Retail];
GO

-- 1. Seed Kategorie_Atrybuty
PRINT 'Seeding Kategorie_Atrybuty...';

MERGE [dbo].[Kategorie_Atrybuty] AS t
USING (VALUES
    -- Electronics (1)
    (1, 4, 1, 1), -- Screen Size
    (1, 5, 1, 2), -- RAM
    (1, 6, 1, 3), -- Storage
    -- Clothes (2)
    (2, 1, 1, 1), -- Color
    (2, 3, 1, 2), -- Size
    (2, 2, 0, 3), -- Material
    -- Furniture (3)
    (3, 7, 1, 1), -- Width
    (3, 8, 1, 2), -- Height
    (3, 9, 0, 3), -- Depth
    (3, 2, 0, 4)  -- Material
) AS s(KategoriaID, AtrybutID, IsRequired, SortOrder)
ON t.KategoriaID = s.KategoriaID AND t.AtrybutID = s.AtrybutID
WHEN MATCHED THEN UPDATE SET
    t.IsRequired = s.IsRequired,
    t.SortOrder = s.SortOrder
WHEN NOT MATCHED THEN
    INSERT (KategoriaID, AtrybutID, IsRequired, SortOrder)
    VALUES (s.KategoriaID, s.AtrybutID, s.IsRequired, s.SortOrder);
GO

-- 2. Seed missing Produkt_Atrybuty (New additions)
PRINT 'Seeding new Produkt_Atrybuty...';

SET IDENTITY_INSERT [dbo].[Produkt_Atrybuty] ON;

MERGE [dbo].[Produkt_Atrybuty] AS t
USING (VALUES
    -- Product 1 (Chair): Height=95, Depth=90
    (7, 1, 8, N'95'), 
    (8, 1, 9, N'90'),
    
    -- Product 3 (Phone): RAM=12, Storage=256
    (9, 3, 5, N'12'),
    (10, 3, 6, N'256')
) AS s(WartoscID, ProduktID, AtrybutID, WartoscString)
ON t.WartoscID = s.WartoscID
WHEN MATCHED THEN UPDATE SET
    t.ProduktID = s.ProduktID,
    t.AtrybutID = s.AtrybutID,
    t.WartoscString = s.WartoscString
WHEN NOT MATCHED THEN
    INSERT (WartoscID, ProduktID, AtrybutID, WartoscString, CreatedAt)
    VALUES (s.WartoscID, s.ProduktID, s.AtrybutID, s.WartoscString, SYSUTCDATETIME());

SET IDENTITY_INSERT [dbo].[Produkt_Atrybuty] OFF;
GO

PRINT 'Done.';
