# Homeverse Technical Documentation

## Frontend Architecture

### Components Structure

#### 1. Core Pages
- **Home Page (`index.html`)**
  - Hero section with property search
  - Featured listings
  - Services overview
  - About section
  - Blog section
  - CTA section

- **Property Listings (`properties.html`)**
  - Advanced search filters
  - Property cards
  - Pagination
  - Sort options

- **Property Details (`property-details.html`)**
  - Image gallery
  - Property information
  - Features list
  - Contact form
  - Similar properties

- **User Dashboard**
  - Profile management
  - Saved properties
  - Listed properties
  - Messages
  - Settings

#### 2. CSS Structure (`assets/css/`)
- **`style.css`**: Main stylesheet
  - Custom properties
  - Reset styles
  - Typography
  - Layout components
  - Responsive design
  - Animations

- **Component-specific CSS**
  - `home-value.css`
  - `property-search.css`
  - `profile.css`
  - `auth.css`

#### 3. JavaScript Modules (`assets/js/`)
- Property search functionality
- Form validation
- Image gallery
- Interactive maps
- Authentication handlers
- API integrations

### Frontend Features

#### 1. Advanced Property Search
- Location-based search
- Price range filters
- Property type filters
- Amenities filters
- Save search preferences

#### 2. User Interface Components
- Responsive navigation
- Modal dialogs
- Toast notifications
- Loading states
- Error handling
- Form validation

#### 3. Property Management
- Property listing creation
- Image upload
- Property editing
- Listing status management

#### 4. User Features
- Authentication system
- Profile management
- Saved searches
- Property favorites
- Message center

## Backend Architecture

### Core Components

#### 1. Server Setup
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

#### 2. Database Models
- **User Model**
  - Authentication details
  - Profile information
  - Saved properties
  - Listed properties

- **Property Model**
  - Basic information
  - Location data
  - Features and amenities
  - Media files
  - Pricing details

- **Enquiry Model**
  - User information
  - Property reference
  - Message content
  - Status tracking

#### 3. API Endpoints

##### Authentication Routes
```javascript
// User registration
POST /api/auth/register
// User login
POST /api/auth/login
// Password reset
POST /api/auth/reset-password
```

##### Property Routes
```javascript
// Get all properties
GET /api/properties
// Get single property
GET /api/properties/:id
// Create property
POST /api/properties
// Update property
PUT /api/properties/:id
// Delete property
DELETE /api/properties/:id
```

##### User Routes
```javascript
// Get user profile
GET /api/users/profile
// Update profile
PUT /api/users/profile
// Get user listings
GET /api/users/listings
// Get saved properties
GET /api/users/saved
```

### Security Features

#### 1. Authentication
- JWT token-based authentication
- Password hashing with bcrypt
- Token refresh mechanism
- Session management

#### 2. Data Validation
- Input sanitization
- Request validation
- File upload validation
- Error handling middleware

#### 3. Security Middleware
```javascript
// JWT Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
```

### Database Schema

#### User Schema
```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  createdAt: { type: Date, default: Date.now }
});
```

#### Property Schema
```javascript
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  features: [{
    type: String,
    enum: ['parking', 'garden', 'security', 'internet']
  }],
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available', 'sold', 'rented'] },
  createdAt: { type: Date, default: Date.now }
});
```

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use meaningful variable names
- Comment complex logic
- Keep functions small and focused
- Use consistent formatting

### Testing
- Unit tests for components
- API endpoint testing
- Integration testing
- End-to-end testing
- Performance testing

### Deployment
- Environment configuration
- Build optimization
- Asset compression
- Cache management
- Error logging

### Performance Optimization
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Database indexing

## Third-party Integrations

### Maps Integration
- Google Maps API
- Location services
- Geocoding
- Distance calculation

### Payment Processing
- Stripe integration
- Payment verification
- Subscription management
- Invoice generation

### Email Service
- Transactional emails
- Newsletter system
- Email templates
- Delivery tracking

### File Storage
- AWS S3 integration
- Image processing
- File validation
- Storage management

## Maintenance and Updates

### Regular Tasks
- Security updates
- Dependency updates
- Database backups
- Log rotation
- Performance monitoring

### Documentation
- API documentation
- Code documentation
- User guides
- Deployment guides
- Troubleshooting guides 