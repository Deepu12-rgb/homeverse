@echo off
echo === Homeverse Troubleshooting Script ===
echo.

echo === Checking if MongoDB is installed ===
where mongod >nul 2>&1
if %errorlevel% neq 0 (
  echo MongoDB is not installed or not in PATH
  echo Please install MongoDB or use a cloud-based MongoDB solution
  echo Update the MONGO_URI in backend\.env accordingly
) else (
  echo MongoDB is installed
)
echo.

echo === Checking if required ports are available ===
netstat -an | find "LISTENING" | find ":5000" >nul
if %errorlevel% equ 0 (
  echo Port 5000 is in use by another application
  echo Please change the PORT in backend\.env or stop the application using port 5000
) else (
  echo Port 5000 is available for the backend
)

netstat -an | find "LISTENING" | find ":8080" >nul
if %errorlevel% equ 0 (
  echo Port 8080 is in use by another application
  echo Please change the PORT in frontend\server.js or stop the application using port 8080
) else (
  echo Port 8080 is available for the frontend
)
echo.

echo === Checking backend dependencies ===
cd backend
echo Running npm install in backend...
npm install
cd ..
echo.

echo === Checking frontend dependencies ===
cd frontend
echo Running npm install in frontend...
npm install
cd ..
echo.

echo === Starting servers ===
echo Starting backend...
start cmd /k "cd backend && npm start"
timeout /t 5
echo Starting frontend...
start cmd /k "cd frontend && npm start"
timeout /t 5
echo.

echo === Try accessing the application ===
echo 1. Open your browser and navigate to: http://localhost:8080
echo 2. If that doesn't work, try: http://127.0.0.1:8080
echo 3. Check for any error messages in the server terminal windows
echo.

echo === Troubleshooting complete ===
echo If you're still having issues, please check the following:
echo 1. Make sure MongoDB is running if you're using a local instance
echo 2. Check for firewall issues that might be blocking connections
echo 3. Try using a different browser
echo 4. Check the console in your browser developer tools for any errors
echo. 