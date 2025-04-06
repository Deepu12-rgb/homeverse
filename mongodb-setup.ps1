Write-Host "=== MongoDB Setup Script ===" -ForegroundColor Green
Write-Host ""

Write-Host "=== Checking if MongoDB is installed ===" -ForegroundColor Yellow
try {
    $mongod = Get-Command mongod -ErrorAction Stop
    Write-Host "MongoDB is installed at $($mongod.Source)" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "=== Checking if MongoDB is running ===" -ForegroundColor Yellow
    
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoService) {
        if ($mongoService.Status -eq "Running") {
            Write-Host "MongoDB service is running" -ForegroundColor Green
        } else {
            Write-Host "MongoDB service is not running" -ForegroundColor Red
            Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
            Start-Service -Name "MongoDB"
        }
    } else {
        Write-Host "MongoDB service not found. You may need to start it manually." -ForegroundColor Yellow
        Write-Host "Try running 'mongod' in a separate terminal window." -ForegroundColor Yellow
    }
} catch {
    Write-Host "MongoDB is not installed or not in PATH" -ForegroundColor Red
    
    Write-Host "Would you like to:" -ForegroundColor Yellow
    Write-Host "1. Use MongoDB Atlas (cloud version)" -ForegroundColor Cyan
    Write-Host "2. Install MongoDB locally" -ForegroundColor Cyan
    
    $choice = Read-Host "Enter your choice (1-2)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "=== Setting up MongoDB Atlas ===" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please register for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register" -ForegroundColor Cyan
        Write-Host "After creating your account and cluster, get your connection string" -ForegroundColor Cyan
        Write-Host ""
        
        $connString = Read-Host "Enter your MongoDB Atlas connection string"
        Write-Host ""
        
        Write-Host "Updating .env file..." -ForegroundColor Yellow
        (Get-Content ".\backend\.env") -replace 'MONGO_URI=mongodb://localhost:27017/homeverse', "MONGO_URI=$connString" | Set-Content ".\backend\.env"
        
        Write-Host "MongoDB Atlas configuration complete!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "=== Installing MongoDB locally ===" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please download and install MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
        Write-Host "Follow the installation instructions for your operating system" -ForegroundColor Cyan
        Write-Host "After installation, make sure MongoDB service is running" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Once MongoDB is installed, run this script again to verify" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "=== MongoDB Setup Complete ===" -ForegroundColor Green
Write-Host "If you're having connection issues, please check the MongoDB connection string in backend\.env" -ForegroundColor Cyan
Write-Host "" 