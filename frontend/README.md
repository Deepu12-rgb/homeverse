# Homeverse Frontend

This is the frontend part of the Homeverse real estate platform. It provides a user interface for browsing properties, viewing property details, and interacting with the platform's features.

## Directory Structure

```
frontend/
├── node_modules/       # Node.js dependencies
├── public/             # Public assets (favicon, etc.)
├── src/                # Source code
│   ├── assets/         # Static assets
│   │   ├── css/        # CSS stylesheets
│   │   ├── images/     # Images and icons
│   │   ├── js/         # JavaScript files
│   │   ├── models/     # 3D models
│   │   └── videos/     # Video files
│   ├── components/     # Reusable UI components
│   ├── pages/          # HTML pages
│   ├── services/       # API services and data fetching
│   ├── utils/          # Utility functions
│   └── index.js        # Main entry point
├── package.json        # Project dependencies and scripts
└── README.md           # Frontend documentation
```

## Features

- Property listings with detailed information
- Property search and filtering
- Wishlist functionality
- 3D property views
- User authentication
- Enquiry forms
- Location-based property search
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Access the application at http://localhost:3000

## CSS Organization

The CSS files are organized as follows:

- `style.css`: Main stylesheet with global styles and variables
- `queries.css`: Media queries for responsive design
- `wishlist.css`: Styles for the wishlist feature
- `location.css`: Styles for the location feature
- `enquiry.css`: Styles for the enquiry modal
- `service-actions.css`: Styles for service actions
- `property-3d.css`: Styles for 3D property views
- `amenities.css`: Styles for property amenities
- `add-listing.css`: Styles for the add listing page

## JavaScript Organization

The JavaScript files are organized as follows:

- `script.js`: Main JavaScript file with global functionality
- `wishlist.js`: Wishlist functionality
- `location.js`: Location-based search functionality
- `enquiry.js`: Enquiry form handling
- `service-actions.js`: Service actions functionality
- `property-card.js`: Property card interactions
- `amenities.js`: Property amenities functionality
- `buttons.js`: Button interactions

## Pages

- `index.html`: Home page
- `property-details.html`: Property details page
- `property-3d.html`: 3D property view
- `add-listing.html`: Add listing page
- `login.html`: Login page
- `signup.html`: Signup page
- `profile.html`: User profile page
- `contact.html`: Contact page
- `blog.html`: Blog page
- `blog-details.html`: Blog details page
- `faq.html`: FAQ page
- `terms.html`: Terms and conditions page

## API Integration

The frontend communicates with the backend API for data retrieval and manipulation. API endpoints are defined in the services directory. 