USE Retail;
GO

-- 1. Create Lookup Tables
CREATE TABLE Status_Zamowienia (
    StatusID INT PRIMARY KEY,
    Nazwa NVARCHAR(50) NOT NULL
);

CREATE TABLE Status_Faktury (
    StatusID INT PRIMARY KEY,
    Nazwa NVARCHAR(50) NOT NULL
);

CREATE TABLE Typ_Platnosci (
    TypID INT PRIMARY KEY,
    Nazwa NVARCHAR(50) NOT NULL
);

-- 2. Insert Seed Data
INSERT INTO Status_Zamowienia (StatusID, Nazwa) VALUES 
(1, 'Nowe'), (2, 'Opłacone'), (3, 'W realizacji'), (4, 'Wysłane'), (5, 'Zakończone'), (6, 'Anulowane');

INSERT INTO Status_Faktury (StatusID, Nazwa) VALUES 
(1, 'Wystawiona'), (2, 'Opłacona'), (3, 'Anulowana');

INSERT INTO Typ_Platnosci (TypID, Nazwa) VALUES 
(1, 'Karta płatnicza'), (2, 'BLIK'), (3, 'Przelew tradycyjny');


-- 3. Create Main Tables
CREATE TABLE Zamowienia (
    ZamowienieID INT IDENTITY(1,1) PRIMARY KEY,
    KlientID INT NOT NULL,
    StatusID INT NOT NULL,
    DataZamowienia DATETIME2 DEFAULT GETUTCDATE(),
    Suma DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (KlientID) REFERENCES Klienci(KlientID),
    FOREIGN KEY (StatusID) REFERENCES Status_Zamowienia(StatusID)
);

CREATE TABLE Pozycje_Zamowienia (
    PozycjaID INT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieID INT NOT NULL,
    ProduktID INT NOT NULL,
    Ilosc INT NOT NULL,
    CenaJednostkowa DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (ZamowienieID) REFERENCES Zamowienia(ZamowienieID) ON DELETE CASCADE,
    FOREIGN KEY (ProduktID) REFERENCES Produkty(ProduktID)
);

CREATE TABLE Faktury (
    FakturaID INT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieID INT NOT NULL,
    StatusID INT NOT NULL,
    DataWystawienia DATETIME2 DEFAULT GETUTCDATE(),
    Kwota DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (ZamowienieID) REFERENCES Zamowienia(ZamowienieID),
    FOREIGN KEY (StatusID) REFERENCES Status_Faktury(StatusID)
);

CREATE TABLE Platnosci (
    PlatnoscID INT IDENTITY(1,1) PRIMARY KEY,
    FakturaID INT NOT NULL,
    TypPlatnosciID INT NOT NULL,
    Kwota DECIMAL(18,2) NOT NULL,
    DataPlatnosci DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (FakturaID) REFERENCES Faktury(FakturaID),
    FOREIGN KEY (TypPlatnosciID) REFERENCES Typ_Platnosci(TypID)
);

CREATE TABLE Dostawy (
    DostawaID INT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieID INT NOT NULL,
    Status NVARCHAR(50),
    NumerSledzenia NVARCHAR(100),
    FOREIGN KEY (ZamowienieID) REFERENCES Zamowienia(ZamowienieID)
);

-- LOGISTICS TABLES

CREATE TABLE Status_Dostawy (
    StatusDostawyID INT PRIMARY KEY,
    Nazwa NVARCHAR(50) NOT NULL
);

INSERT INTO Status_Dostawy (StatusDostawyID, Nazwa) VALUES (1, 'Utworzona'), (2, 'Nadana'), (3, 'Dostarczona');

CREATE TABLE Status_Zamowienia_Dostawcy (
    StatusID INT PRIMARY KEY,
    Nazwa NVARCHAR(50) NOT NULL
);

INSERT INTO Status_Zamowienia_Dostawcy (StatusID, Nazwa) VALUES (1, 'Utworzone'), (2, 'Wysłane'), (3, 'Przyjęte'), (4, 'Anulowane');

CREATE TABLE Dostawcy (
    DostawcaID INT IDENTITY(1,1) PRIMARY KEY,
    Nazwa NVARCHAR(255) NOT NULL
);

-- Updated Dostawy Table
CREATE TABLE Dostawy (
    DostawaID INT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieID INT NOT NULL,
    Status NVARCHAR(50), -- Legacy
    NumerPrzesylki NVARCHAR(100),
    FirmaKurierska NVARCHAR(100), -- Legacy/Alias
    Carrier NVARCHAR(100),
    ServiceLevel NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    StatusDostawyID INT NOT NULL DEFAULT 1,
    FOREIGN KEY (ZamowienieID) REFERENCES Zamowienia(ZamowienieID),
    FOREIGN KEY (StatusDostawyID) REFERENCES Status_Dostawy(StatusDostawyID)
);

CREATE TABLE Dostawy_Pozycje (
    DostawaID INT NOT NULL,
    PozycjaZamowieniaID INT NOT NULL,
    Ilosc INT NOT NULL,
    PRIMARY KEY (DostawaID, PozycjaZamowieniaID),
    FOREIGN KEY (DostawaID) REFERENCES Dostawy(DostawaID),
    FOREIGN KEY (PozycjaZamowieniaID) REFERENCES Pozycje_Zamowienia(PozycjaID)
);

CREATE TABLE Dostawa_Status_Historia (
    HistoriaID BIGINT IDENTITY(1,1) PRIMARY KEY,
    DostawaID INT NOT NULL,
    StatusDostawyID INT NOT NULL,
    ChangedAt DATETIME2 DEFAULT GETUTCDATE(),
    Comment NVARCHAR(MAX) NULL
);

-- Supply Chain

CREATE TABLE Zamowienia_Dostawcow (
    ZamowienieDostawcyID INT IDENTITY(1,1) PRIMARY KEY,
    DostawcaID INT NOT NULL,
    MagazynID INT NULL,
    StatusID INT NOT NULL,
    DataUtworzenia DATETIME2 DEFAULT GETUTCDATE(),
    DataOczekiwana DATETIME2 NULL,
    Comment NVARCHAR(MAX) NULL,
    FOREIGN KEY (DostawcaID) REFERENCES Dostawcy(DostawcaID),
    FOREIGN KEY (StatusID) REFERENCES Status_Zamowienia_Dostawcy(StatusID)
);

CREATE TABLE Pozycje_Zamowienia_Dostawcy (
    PozycjaDostawcyID INT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieDostawcyID INT NOT NULL,
    ProduktID INT NOT NULL,
    IloscZamowiona INT NOT NULL,
    CenaZakupu DECIMAL(18,2) NULL,
    FOREIGN KEY (ZamowienieDostawcyID) REFERENCES Zamowienia_Dostawcow(ZamowienieDostawcyID),
    FOREIGN KEY (ProduktID) REFERENCES Produkty(ProduktID)
);

CREATE TABLE Przyjecia_PZ (
    PZID INT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieDostawcyID INT NOT NULL,
    MagazynID INT NULL,
    NumerDokumentu NVARCHAR(100),
    DataPrzyjecia DATETIME2 DEFAULT GETUTCDATE(),
    KosztDostawy DECIMAL(18,2) NULL,
    Comment NVARCHAR(MAX) NULL,
    FOREIGN KEY (ZamowienieDostawcyID) REFERENCES Zamowienia_Dostawcow(ZamowienieDostawcyID)
);

CREATE TABLE Pozycje_PZ (
    PZPozycjaID INT IDENTITY(1,1) PRIMARY KEY,
    PZID INT NOT NULL,
    ProduktID INT NOT NULL,
    IloscPrzyjeta INT NOT NULL,
    IloscUszkodzona INT NOT NULL DEFAULT 0,
    FOREIGN KEY (PZID) REFERENCES Przyjecia_PZ(PZID),
    FOREIGN KEY (ProduktID) REFERENCES Produkty(ProduktID)
);

CREATE TABLE Historia_Magazynu (
    HistoriaID BIGINT IDENTITY(1,1) PRIMARY KEY,
    ProduktID INT NOT NULL,
    MagazynID INT NULL,
    ZamowienieID INT NULL,
    TypZdarzenia NVARCHAR(100) NOT NULL,
    IloscZmiana INT NOT NULL,
    IloscPrzed INT NULL,
    IloscPo INT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE Zamowienie_Status_Historia (
    HistoriaID BIGINT IDENTITY(1,1) PRIMARY KEY,
    ZamowienieID INT NOT NULL,
    StatusID INT NOT NULL,
    ChangedAt DATETIME2 DEFAULT GETUTCDATE(),
    Comment NVARCHAR(MAX) NULL
);

CREATE TABLE Zamowienie_DaneFakturowania (
    ZamowienieID INT PRIMARY KEY,
    NabywcaNazwa NVARCHAR(255) NOT NULL,
    NIP NVARCHAR(50) NOT NULL,
    Adres NVARCHAR(255) NOT NULL,
    Miasto NVARCHAR(100) NOT NULL,
    KodPocztowy NVARCHAR(20) NOT NULL,
    Kraj NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (ZamowienieID) REFERENCES Zamowienia(ZamowienieID)
);
GO
