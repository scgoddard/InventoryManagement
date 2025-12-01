@echo off
REM Quick-start script for Windows users

echo ==========================================
echo Army Inventory Management System Updater
echo ==========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.6 or higher
    pause
    exit /b 1
)

REM Check if Excel file exists
if not exist "Inventory Managment System.xlsx" (
    echo ERROR: Inventory Managment System.xlsx not found!
    pause
    exit /b 1
)

REM Create backup directory
if not exist "backups" mkdir backups

REM Create backup with timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set timestamp=%mydate%_%mytime%

echo Creating backup...
copy "Inventory Managment System.xlsx" "backups\Inventory_Backup_%timestamp%.xlsx" >nul
echo Backup saved to: backups\Inventory_Backup_%timestamp%.xlsx
echo.

REM Install dependencies if needed
echo Checking dependencies...
python -c "import openpyxl, pandas" 2>nul
if errorlevel 1 (
    echo Installing required packages...
    pip install openpyxl pandas numpy
    echo Dependencies installed
)
echo.

REM Run the update script
echo Processing form responses...
python update_inventory.py
echo.

echo ==========================================
echo Update complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Open 'Inventory Managment System.xlsx' to view updates
echo 2. Check Dashboard for current metrics
echo 3. Verify Gear Inventory and Checkout Log
echo.
echo Backup location: backups\Inventory_Backup_%timestamp%.xlsx
echo.

pause
