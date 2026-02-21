-- Clear existing entries just in case (though table is reportedly empty)
TRUNCATE TABLE Produkt_Kategorie;
GO

-- Furniture (Cat ID 3) & Subcategories
-- 1: Krzeslo drewniane -> Dining & Kitchen (6)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (1, 6);
-- 2: Stol rozkladany -> Dining & Kitchen (6)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (2, 6);
-- 3: Lampa stojaca -> Furniture (3) (Generic) or maybe Decor if exists (it doesnt)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (3, 3);
-- 4: Garnki stalowe -> Dining & Kitchen (6)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (4, 6);
-- 5: Szafa 3-drzwiowa -> Dressers & Chests (5) (Close match)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (5, 5);
-- 6: Juniper Velvet Seat -> Ottomans & Poufs (4) or Furniture (3)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (6, 3);
-- 7: Nordic Nightstand -> Furniture (3)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (7, 5); -- Dressers & Chests
-- 8: Minimalist Ottoman -> Ottomans & Poufs (4)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (8, 4);
-- 9: Lounge Seat v2 -> Furniture (3)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (9, 3);
-- 10: Emerald Kitchen Island -> Kitchen Islands & Carts (8)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (10, 8);
-- 11: Oak Sideboard -> Sideboards & Buffets (7)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (11, 7);
-- 12: Industrial Bookshelf -> Bookcases & Bookshelves (9)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (12, 9);
-- 13: Patio Dining Set -> Patio Dining Sets (11)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (13, 11);
-- 14: Aria Dining Table -> Dining & Kitchen (6)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (14, 6);
-- 15: Sage Velvet Armchair -> Furniture (3)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (15, 3);
-- 16: Marble Console Table -> Sideboards & Buffets (7) or generic
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (16, 7);

-- Electronics (Cat ID 1) & Subcategories
-- 17: iPhone 15 Pro Max -> Smartphones (12)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (17, 12);
-- 18: Sony WH-1000XM5 -> Audio & Headphones (13)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (18, 13);
-- 19: MacBook Pro M3 -> Laptops & Computers (14)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (19, 14);
-- 20: Smart LED Lamp -> Smart Home (15)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (20, 15);
-- 21: Apple Watch Ultra 2 -> Wearables (16)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (21, 16);

-- Clothes (Cat ID 2) & Subcategories
-- 22: Premium Cotton T-Shirt -> Men's Apparel (17)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (22, 17);
-- 23: Linen Summer Dress -> Women's Apparel (18)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (23, 18);
-- 24: Organic Cotton Hoodie -> Men's Apparel (17) or Unisex/Essentials (19)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (24, 19);
-- 25: Leather Belt -> Accessories (20)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (25, 20);
-- 26: Wool Blend Blazer -> Men's Apparel (17)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (26, 17);
-- 27: Silk Blouse -> Women's Apparel (18)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (27, 18);
-- 28: Cashmere Cardigan -> Women's Apparel (18)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (28, 18);
-- 29: Canvas Tote Bag -> Accessories (20)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (29, 20);
-- 30: Oversized Merino Wool Sweater -> Essentials (19)
INSERT INTO Produkt_Kategorie (ProduktID, KategoriaID) VALUES (30, 19);
