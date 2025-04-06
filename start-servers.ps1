Write-Host "Starting Homeverse servers..." -ForegroundColor Green

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host "Servers started! Access the application at http://localhost:8080" -ForegroundColor Green
Write-Host "API test page available at http://localhost:8080/api-test.html" -ForegroundColor Green 