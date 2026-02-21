-- ============================================================
-- RETAILEN Database Backup Strategy
-- Full + Differential + Transaction Log Backups
-- ============================================================
-- This script can be run in SQL Server Management Studio (SSMS)
-- or scheduled via SQL Server Agent.
-- ============================================================

USE master;
GO

-- ────────────────────────────────────────
-- 1. FULL BACKUP — Run daily (e.g., 02:00 AM)
-- ────────────────────────────────────────
DECLARE @FullBackupPath NVARCHAR(500);
SET @FullBackupPath = N'C:\SQLBackups\RETAILEN_FULL_' 
    + FORMAT(GETDATE(), 'yyyyMMdd_HHmmss') + N'.bak';

BACKUP DATABASE [RETAILEN]
TO DISK = @FullBackupPath
WITH 
    FORMAT,                         -- Overwrite media header
    INIT,                           -- Overwrite existing backup set
    NAME = N'RETAILEN Full Backup',
    COMPRESSION,                    -- Compress backup (saves ~60-70% space)
    STATS = 10,                     -- Show progress every 10%
    CHECKSUM;                       -- Verify backup integrity

PRINT 'Full backup completed: ' + @FullBackupPath;
GO

-- ────────────────────────────────────────
-- 2. DIFFERENTIAL BACKUP — Run every 6 hours
-- ────────────────────────────────────────
DECLARE @DiffBackupPath NVARCHAR(500);
SET @DiffBackupPath = N'C:\SQLBackups\RETAILEN_DIFF_' 
    + FORMAT(GETDATE(), 'yyyyMMdd_HHmmss') + N'.bak';

BACKUP DATABASE [RETAILEN]
TO DISK = @DiffBackupPath
WITH 
    DIFFERENTIAL,                   -- Differential backup
    INIT,
    NAME = N'RETAILEN Differential Backup',
    COMPRESSION,
    STATS = 10,
    CHECKSUM;

PRINT 'Differential backup completed: ' + @DiffBackupPath;
GO

-- ────────────────────────────────────────
-- 3. TRANSACTION LOG BACKUP — Run every 30 minutes
-- ────────────────────────────────────────
DECLARE @LogBackupPath NVARCHAR(500);
SET @LogBackupPath = N'C:\SQLBackups\RETAILEN_LOG_' 
    + FORMAT(GETDATE(), 'yyyyMMdd_HHmmss') + N'.trn';

BACKUP LOG [RETAILEN]
TO DISK = @LogBackupPath
WITH 
    INIT,
    NAME = N'RETAILEN Transaction Log Backup',
    COMPRESSION,
    STATS = 10,
    CHECKSUM;

PRINT 'Transaction log backup completed: ' + @LogBackupPath;
GO

-- ────────────────────────────────────────
-- 4. VERIFY LAST BACKUP INTEGRITY
-- ────────────────────────────────────────
DECLARE @LastBackup NVARCHAR(500);
SELECT TOP 1 @LastBackup = bmf.physical_device_name
FROM msdb.dbo.backupset bs
JOIN msdb.dbo.backupmediafamily bmf ON bs.media_set_id = bmf.media_set_id
WHERE bs.database_name = N'RETAILEN'
ORDER BY bs.backup_finish_date DESC;

IF @LastBackup IS NOT NULL
BEGIN
    RESTORE VERIFYONLY FROM DISK = @LastBackup WITH CHECKSUM;
    PRINT 'Backup verification passed: ' + @LastBackup;
END
GO

-- ────────────────────────────────────────
-- 5. CLEANUP OLD BACKUPS (older than 30 days)
-- ────────────────────────────────────────
DECLARE @CleanupDate DATETIME;
SET @CleanupDate = DATEADD(DAY, -30, GETDATE());

EXEC xp_delete_files 
    N'C:\SQLBackups\', 
    N'bak', 
    @CleanupDate, 
    1;  -- Include subdirectories

EXEC xp_delete_files 
    N'C:\SQLBackups\', 
    N'trn', 
    @CleanupDate, 
    1;

PRINT 'Old backups cleaned up (older than 30 days).';
GO

-- ============================================================
-- RESTORE PROCEDURE (for disaster recovery)
-- ============================================================
-- To restore from backups, run these steps in order:
--
-- 1. Restore FULL backup:
--    RESTORE DATABASE [RETAILEN] 
--    FROM DISK = 'C:\SQLBackups\RETAILEN_FULL_xxx.bak'
--    WITH NORECOVERY, REPLACE;
--
-- 2. Restore latest DIFFERENTIAL:
--    RESTORE DATABASE [RETAILEN]
--    FROM DISK = 'C:\SQLBackups\RETAILEN_DIFF_xxx.bak'
--    WITH NORECOVERY;
--
-- 3. Restore all LOG backups after differential:
--    RESTORE LOG [RETAILEN]
--    FROM DISK = 'C:\SQLBackups\RETAILEN_LOG_xxx.trn'
--    WITH NORECOVERY;
--    -- Repeat for each subsequent log file
--
-- 4. Finalize recovery:
--    RESTORE DATABASE [RETAILEN] WITH RECOVERY;
-- ============================================================
