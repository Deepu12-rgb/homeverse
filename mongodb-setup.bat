@echo off
echo === MongoDB Setup Script ===
echo.

echo === Checking if MongoDB is installed ===
where mongod >nul 2>&1
if %errorlevel% neq 0 (
  echo MongoDB is not installed or not in PATH
  echo Would you like to:
  echo 1. Use MongoDB Atlas (cloud version)
  echo 2. Install MongoDB locally
  set /p choice="Enter your choice (1-2): "
  
  if "%choice%"=="1" (
    echo.
    echo === Setting up MongoDB Atlas ===
    echo.
    echo Please register for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
    echo After creating your account and cluster, get your connection string
    echo.
    set /p conn_string="Enter your MongoDB Atlas connection string: "
    echo.
    echo Updating .env file...
    powershell -Command "(Get-Content backend\.env) -replace 'MONGO_URI=mongodb://localhost:27017/homeverse', 'MONGO_URI=%conn_string%' | Set-Content backend\.env"
    echo MongoDB Atlas configuration complete!
  ) else (
    echo.
    echo === Installing MongoDB locally ===
    echo.
    echo Please download and install MongoDB from https://www.mongodb.com/try/download/community
    echo Follow the installation instructions for your operating system
    echo After installation, make sure MongoDB service is running
    echo.
    echo Once MongoDB is installed, run this script again to verify
  )
) else (
  echo MongoDB is installed
  echo.
  echo === Checking if MongoDB is running ===
  powershell -Command "if (Get-Service -Name 'MongoDB' -ErrorAction SilentlyContinue) { $service = Get-Service -Name 'MongoDB'; if ($service.Status -eq 'Running') { Write-Host 'MongoDB service is running' } else { Write-Host 'MongoDB service is not running'; Write-Host 'Starting MongoDB service...'; Start-Service -Name 'MongoDB' } } else { Write-Host 'MongoDB service not found. You may need to start it manually.' }"
)
echo.

echo === MongoDB Setup Complete ===
echo If you're having connection issues, please check the MongoDB connection string in backend\.env
echo. 