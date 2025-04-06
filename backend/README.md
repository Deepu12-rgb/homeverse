# Homeverse Backend

This is the backend part of the Homeverse real estate platform. It provides API endpoints for property listings, user authentication, and other features.

## Directory Structure

```
backend/
├── node_modules/       # Node.js dependencies
├── public/             # Public assets
├── src/                # Source code
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.js        # Main entry point
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
└── README.md           # Backend documentation
```

## Features

- RESTful API endpoints for property listings
- User authentication and authorization
- Property search and filtering
- Enquiry form submission
- MongoDB database integration
- JWT-based authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The API will be available at http://localhost:5000/api

## API Endpoints

### Public Endpoints

- `GET /api/public/enquiries`: Get all public enquiries
- `POST /api/public/enquiries`: Submit a new enquiry

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user information

### Property Endpoints

- `GET /api/properties`: Get all properties
- `GET /api/properties/:id`: Get a specific property
- `POST /api/properties`: Create a new property (requires authentication)
- `PUT /api/properties/:id`: Update a property (requires authentication)
- `DELETE /api/properties/:id`: Delete a property (requires authentication)

### User Endpoints

- `GET /api/users/profile`: Get user profile (requires authentication)
- `PUT /api/users/profile`: Update user profile (requires authentication)

## Database Models

### User Model

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `role`: String (enum: ['user', 'agent', 'admin'])
- `createdAt`: Date

### Property Model

- `title`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `location`: String (required)
- `bedrooms`: Number
- `bathrooms`: Number
- `area`: Number
- `type`: String (enum: ['house', 'apartment', 'condo', 'land'])
- `status`: String (enum: ['for-sale', 'for-rent'])
- `features`: Array of Strings
- `images`: Array of Strings
- `agent`: ObjectId (reference to User model)
- `createdAt`: Date

### Enquiry Model

- `name`: String (required)
- `email`: String (required)
- `phone`: String
- `message`: String (required)
- `property`: ObjectId (reference to Property model)
- `createdAt`: Date

## Authentication

The backend uses JWT (JSON Web Tokens) for authentication. When a user logs in, a token is generated and returned to the client. This token should be included in the Authorization header for protected routes.

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Middleware

- `auth.js`: Authentication middleware to protect routes
- `error.js`: Error handling middleware
- `validate.js`: Request validation middleware 