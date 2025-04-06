# Homeverse Troubleshooting Guide

This guide addresses common issues you might encounter when setting up and running the Homeverse project.

## Common Issues

### Project Not Opening in Browser

If you're having trouble accessing the project in your browser, try the following solutions:

1. **Run the troubleshooting scripts**:
   - For Windows Command Prompt: Run `troubleshoot.bat`
   - For PowerShell: Run `.\troubleshoot.ps1`

2. **Check if servers are running**:
   - Ensure both the frontend and backend servers are running.
   - Check your terminal for any error messages.

3. **Check MongoDB connection**:
   - Ensure MongoDB is installed and running.
   - If using a local MongoDB, run `mongodb-setup.bat` or `.\mongodb-setup.ps1` to set it up.
   - If using MongoDB Atlas, make sure your connection string is correct in `backend/.env`.

4. **Try different URLs**:
   - Instead of `localhost`, try using `127.0.0.1` directly: `http://127.0.0.1:8080`
   - Try a different browser to rule out browser-specific issues.

5. **Check for port conflicts**:
   - Make sure no other applications are using ports 5000 (backend) or 8080 (frontend).
   - You can change these ports in `backend/.env` and `frontend/server.js` if needed.

6. **Firewall or antivirus issues**:
   - Temporarily disable your firewall or antivirus to see if they're blocking connections.
   - Add exceptions for Node.js and MongoDB if necessary.

### Backend Server Issues

If the backend server won't start or is showing errors:

1. **MongoDB connection issues**:
   - Ensure MongoDB is running: `mongodb-setup.bat` or `.\mongodb-setup.ps1`
   - Check the connection string in `backend/.env` file.

2. **Missing dependencies**:
   - Run `cd backend && npm install` to ensure all dependencies are installed.

3. **Port already in use**:
   - Change the port in `backend/.env` if port 5000 is already in use.

### Frontend Server Issues

If the frontend server won't start or is showing errors:

1. **Missing dependencies**:
   - Run `cd frontend && npm install` to ensure all dependencies are installed.

2. **Port already in use**:
   - Change the port in `frontend/server.js` if port 8080 is already in use.

3. **Path issues**:
   - Ensure that the `frontend/server.js` file is correctly serving static files from the right directory.

## Browser Console Errors

If you're seeing errors in your browser's developer console:

1. **CORS issues**:
   - Ensure the backend server's CORS settings are correctly configured in `backend/server.js`.

2. **404 Not Found errors**:
   - Check if the requested resources exist and are in the correct location.
   - Ensure the server is correctly configured to serve static files.

3. **Connection refused errors**:
   - Make sure both the frontend and backend servers are running.
   - Check if the frontend is trying to connect to the correct backend URL.

## Database Issues

If you're having database-related issues:

1. **Cannot connect to MongoDB**:
   - If using a local MongoDB, ensure it's installed and running.
   - If using MongoDB Atlas, check your connection string and network settings.

2. **Data not being saved or retrieved**:
   - Check database connection in backend server console logs.
   - Ensure your MongoDB user has the correct permissions.

## Still Having Issues?

If you've tried all the above solutions and are still having problems:

1. Check the server logs for specific error messages.
2. Try restarting your computer to clear any lingering processes.
3. Make sure you have the correct versions of Node.js (v14 or higher) and npm.
4. Consider using MongoDB Atlas instead of a local MongoDB instance if you're having persistent database issues.

## Updated Server Startup:

I've updated your frontend server.js to use port 3000. Now you can:

1. Restart your frontend server:
```
cd frontend
npm start
```

2. Access your application at http://localhost:3000

If you're still having issues after making these changes, run the troubleshooting script:
```
.\troubleshoot.ps1
```

This script checks for port conflicts, MongoDB setup, and starts both servers for you. 