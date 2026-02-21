USE Retail;
GO

SET IDENTITY_INSERT Typ_Platnosci ON;

IF NOT EXISTS (SELECT * FROM Typ_Platnosci WHERE TypPlatnosciID = 1)
    INSERT INTO Typ_Platnosci (TypPlatnosciID, Nazwa) VALUES (1, 'Karta kredytowa');

IF NOT EXISTS (SELECT * FROM Typ_Platnosci WHERE TypPlatnosciID = 2)
    INSERT INTO Typ_Platnosci (TypPlatnosciID, Nazwa) VALUES (2, 'Przelew bankowy');

IF NOT EXISTS (SELECT * FROM Typ_Platnosci WHERE TypPlatnosciID = 3)
    INSERT INTO Typ_Platnosci (TypPlatnosciID, Nazwa) VALUES (3, 'BLIK');

IF NOT EXISTS (SELECT * FROM Typ_Platnosci WHERE TypPlatnosciID = 4)
    INSERT INTO Typ_Platnosci (TypPlatnosciID, Nazwa) VALUES (4, 'PayPal');

SET IDENTITY_INSERT Typ_Platnosci OFF;
GO
