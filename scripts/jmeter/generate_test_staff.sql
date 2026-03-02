-- 1. Get the password hash from our confirmed user
DECLARE @Hash NVARCHAR(500) = (
    SELECT PasswordHash
    FROM dbo.Customer
    WHERE Email = 'customer1@test.com'
);

IF @Hash IS NULL
BEGIN
    PRINT 'Error: customer1@test.com not found. Register this user first in Swagger.';
    RETURN;
END

-- 2. Generate 50 Staff users
DECLARE @i INT = 1;
DECLARE @Email NVARCHAR(100);

WHILE @i <= 50
BEGIN
    SET @Email = 'staff' + RIGHT('000' + CAST(@i AS VARCHAR(3)), 3) + '@test.local';

    IF NOT EXISTS(SELECT 1 FROM dbo.Customer WHERE Email = @Email)
    BEGIN
        INSERT INTO dbo.Customer (
            RoleID, 
            FirstName, 
            LastName, 
            Email, 
            PasswordHash, 
            EmailConfirmed, 
            CreatedAt
        )
        VALUES (
            3,               -- 3 = Staff Role
            'LoadTest', 
            'StaffUser' + CAST(@i AS VARCHAR(3)), 
            @Email, 
            @Hash,           -- Same valid bcrypt hash
            1,               -- Email confirmed!
            GETUTCDATE()
        );
    END
    
    SET @i = @i + 1;
END

PRINT '50 Staff users generated successfully.';

-- 3. Export to CSV (copy-paste results to users_staff.csv)
SELECT 
    Email AS email,
    'Test1234!' AS password   -- Use whatever you registered customer1@test.com with!
FROM dbo.Customer
WHERE Email LIKE 'staff%@test.local'
ORDER BY Email;
