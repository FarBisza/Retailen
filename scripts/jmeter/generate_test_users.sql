-- ============================================================
-- RETAILEN — Create test users for JMeter load testing
-- ============================================================
--
-- STEP 1: Register ONE user via Postman/Swagger:
--   POST http://localhost:5200/api/auth/register
--   Body: { "email": "load001@test.local", 
--           "password": "Test123!",
--           "firstName": "Load", "lastName": "User001" }
--
-- STEP 2: Confirm their email in SQL:
--   UPDATE Customer SET EmailConfirmed = 1 
--   WHERE Email = 'load001@test.local';
--
-- STEP 3: Verify login works via Postman:
--   POST http://localhost:5200/api/auth/login
--   Body: { "email": "load001@test.local", "password": "Test123!" }
--   → Should return accessToken
--
-- STEP 4: Run THIS script to create 200 more users 
--         with the SAME password hash.
-- ============================================================

USE RETAILEN;
GO

-- ═══════════════════════════════════════════════════
-- Grab the hash from the user you just registered
-- ═══════════════════════════════════════════════════
DECLARE @Hash NVARCHAR(500) = (
    SELECT PasswordHash
    FROM dbo.Customer
    WHERE Email = 'load001@test.local'
);

IF @Hash IS NULL
BEGIN
    RAISERROR('User load001@test.local not found! Register them first via API.', 16, 1);
    RETURN;
END

PRINT 'Using hash from load001@test.local: ' + LEFT(@Hash, 30) + '...';

-- ═══════════════════════════════════════════════════
-- Bulk-insert 200 test Customer users (RoleID = 2)
-- All with EmailConfirmed = 1, same password hash
-- ═══════════════════════════════════════════════════
;WITH n AS (
    SELECT TOP (200) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS i
    FROM sys.all_objects
)
INSERT INTO dbo.Customer 
    (FirstName, LastName, Email, PasswordHash, Phone,
     RoleID, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
SELECT
    'Load'                                        AS FirstName,
    CONCAT('User', FORMAT(i + 1, '000'))          AS LastName,
    CONCAT('load', FORMAT(i + 1, '000'), '@test.local') AS Email,
    @Hash                                         AS PasswordHash,
    CONCAT('+1000000', FORMAT(i + 1, '0000'))     AS Phone,
    2                                             AS RoleID,  -- Customer
    1                                             AS IsActive,
    1                                             AS EmailConfirmed,
    SYSUTCDATETIME()                              AS CreatedAt,
    SYSUTCDATETIME()                              AS UpdatedAt
FROM n
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Customer c 
    WHERE c.Email = CONCAT('load', FORMAT(n.i + 1, '000'), '@test.local')
);

PRINT 'Inserted test users (load002 - load201)';
GO

-- ═══════════════════════════════════════════════════
-- Also create a few Staff users for Scenario C
-- (RoleID = 1 = Admin, or RoleID = 3 = Employee)
-- ═══════════════════════════════════════════════════
-- First register a staff user the same way:
--   POST /api/auth/register  →  staff001@test.local / Test123!
-- Then in SQL:
--   UPDATE Customer SET EmailConfirmed = 1, RoleID = 3
--   WHERE Email = 'staff001@test.local';
--
-- For JMeter Scenario C, you only need 5-10 staff accounts.
-- You can create them manually or use similar INSERT approach.

-- ═══════════════════════════════════════════════════
-- Verify: count new test users
-- ═══════════════════════════════════════════════════
SELECT COUNT(*) AS TestUserCount
FROM dbo.Customer
WHERE Email LIKE 'load%@test.local'
  AND IsActive = 1
  AND EmailConfirmed = 1;
GO

-- ═══════════════════════════════════════════════════
-- Export for CSV (copy output to users.csv)
-- ═══════════════════════════════════════════════════
SELECT Email + ',Test123!' AS csv_line
FROM dbo.Customer
WHERE Email LIKE 'load%@test.local'
  AND IsActive = 1
  AND EmailConfirmed = 1
ORDER BY CustomerID;
GO
