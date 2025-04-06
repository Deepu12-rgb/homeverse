Write-Host "=== Homeverse Troubleshooting Script ===" -ForegroundColor Green
Write-Host ""

Write-Host "=== Checking if MongoDB is installed ===" -ForegroundColor Yellow
try {
    $mongod = Get-Command mongod -ErrorAction Stop
    Write-Host "MongoDB is installed at $($mongod.Source)" -ForegroundColor Green
}
catch {
    Write-Host "MongoDB is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install MongoDB or use a cloud-based MongoDB solution" -ForegroundColor Red
    Write-Host "Update the MONGO_URI in backend\.env accordingly" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Checking if required ports are available ===" -ForegroundColor Yellow
$port5000InUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000InUse) {
    Write-Host "Port 5000 is in use by another application (PID: $($port5000InUse.OwningProcess))" -ForegroundColor Red
    Write-Host "Please change the PORT in backend\.env or stop the application using port 5000" -ForegroundColor Red
}
else {
    Write-Host "Port 5000 is available for the backend" -ForegroundColor Green
}

$port8080InUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080InUse) {
    Write-Host "Port 8080 is in use by another application (PID: $($port8080InUse.OwningProcess))" -ForegroundColor Red
    Write-Host "Please change the PORT in frontend\server.js or stop the application using port 8080" -ForegroundColor Red
}
else {
    Write-Host "Port 8080 is available for the frontend" -ForegroundColor Green
}
Write-Host ""

Write-Host "=== Checking backend dependencies ===" -ForegroundColor Yellow
Set-Location -Path .\backend
Write-Host "Running npm install in backend..." -ForegroundColor Cyan
npm install
Set-Location -Path ..
Write-Host ""

Write-Host "=== Checking frontend dependencies ===" -ForegroundColor Yellow
Set-Location -Path .\frontend
Write-Host "Running npm install in frontend..." -ForegroundColor Cyan
npm install
Set-Location -Path ..
Write-Host ""

Write-Host "=== Starting servers ===" -ForegroundColor Yellow
Write-Host "Starting backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"
Start-Sleep -Seconds 5
Write-Host "Starting frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"
Start-Sleep -Seconds 5
Write-Host ""

Write-Host "=== Try accessing the application ===" -ForegroundColor Yellow
Write-Host "1. Open your browser and navigate to: http://localhost:8080" -ForegroundColor Cyan
Write-Host "2. If that doesn't work, try: http://127.0.0.1:8080" -ForegroundColor Cyan
Write-Host "3. Check for any error messages in the server terminal windows" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== Troubleshooting complete ===" -ForegroundColor Green
Write-Host "If you're still having issues, please check the following:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running if you're using a local instance" -ForegroundColor Cyan
Write-Host "2. Check for firewall issues that might be blocking connections" -ForegroundColor Cyan
Write-Host "3. Try using a different browser" -ForegroundColor Cyan
Write-Host "4. Check the console in your browser developer tools for any errors" -ForegroundColor Cyan
Write-Host "" 