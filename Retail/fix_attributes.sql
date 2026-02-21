-- 1. Fix Attribute Definitions to match AppDbContext
-- ID 1: Was Kolor (contains URLs), Code expects ObrazekUrl. 
UPDATE Atrybuty SET Nazwa = 'ObrazekUrl', TypDanych = 'string', Jednostka = NULL WHERE AtrybutID = 1;

-- ID 2: Was Material, Code expects Kategoria (Legacy EAV, but helpful to be consistent)
UPDATE Atrybuty SET Nazwa = 'Kategoria', TypDanych = 'string', Jednostka = NULL WHERE AtrybutID = 2;

-- ID 3: Was Wysokosc, Code expects Styl
UPDATE Atrybuty SET Nazwa = 'Styl', TypDanych = 'string', Jednostka = NULL WHERE AtrybutID = 3;

-- ID 4: Was Szerokosc, Code expects KoloryJSON
UPDATE Atrybuty SET Nazwa = 'KoloryJSON', TypDanych = 'json', Jednostka = NULL WHERE AtrybutID = 4;

-- 2. Clear garbage data from Produkt_Atrybuty for these IDs (except ID 1 if we want to keep legacy image links)
-- Actually, let's just clear ID 3 and 4 to be safe before seeding.
DELETE FROM Produkt_Atrybuty WHERE AtrybutID IN (2, 3, 4);

-- 3. Populate Styles (ID 3)
-- Randomly assign styles: Modern, Urban, Minimalist, Classic, Industrial
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (1, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (2, 3, 'Minimalist');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (3, 3, 'Industrial');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (4, 3, 'Classic');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (5, 3, 'Urban');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (6, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (7, 3, 'Minimalist');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (8, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (9, 3, 'Industrial');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (10, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (11, 3, 'Classic');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (12, 3, 'Industrial');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (13, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (14, 3, 'Minimalist');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (15, 3, 'Urban');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (16, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (17, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (18, 3, 'Urban');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (19, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (20, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (21, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (22, 3, 'Urban');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (23, 3, 'Classic');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (24, 3, 'Urban');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (25, 3, 'Classic');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (26, 3, 'Classic');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (27, 3, 'Modern');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (28, 3, 'Classic');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (29, 3, 'Urban');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (30, 3, 'Modern');

-- 4. Populate Colors (ID 4) - JSON Format
-- Common palette: Beige(#F5E6D3), Black(#1A1A1A), Brown(#A07855), Gray(#9CA3AF), Green(#4D7C0F), Orange(#F59E0B)
-- Example: '["#F5E6D3", "#1A1A1A"]'
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (1, 4, '["#A07855", "#1A1A1A"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (2, 4, '["#FFFFFF", "#9CA3AF"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (3, 4, '["#1A1A1A"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (4, 4, '["#9CA3AF"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (5, 4, '["#F5E6D3", "#A07855"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (6, 4, '["#4D7C0F", "#1A1A1A"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (7, 4, '["#A07855"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (8, 4, '["#9CA3AF", "#1A1A1A"]');
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (17, 4, '["#1A1A1A", "#9CA3AF"]'); -- iPhone
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (22, 4, '["#FFFFFF", "#1A1A1A", "#9CA3AF"]'); -- T-Shirt
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (23, 4, '["#F5E6D3", "#F59E0B"]'); -- Dress
INSERT INTO Produkt_Atrybuty (ProduktID, AtrybutID, WartoscString) VALUES (30, 4, '["#9CA3AF", "#1A1A1A"]'); -- Sweater
