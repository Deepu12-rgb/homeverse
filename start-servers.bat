@echo off
echo Starting Homeverse servers...

echo Starting backend server...
start cmd /k "cd backend && npm start"

echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo Servers started! Access the application at http://localhost:8080
echo API test page available at http://localhost:8080/api-test.html 