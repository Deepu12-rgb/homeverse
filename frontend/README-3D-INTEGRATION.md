# 3D Model API Integration Guide

This guide explains how to integrate the Matterport 3D scanning API with your Homeverse property website.

## Overview

The Homeverse platform now supports 3D model generation from property walkthrough videos. This feature allows real estate agents to:

1. Upload videos of properties
2. Automatically generate 3D virtual tours  
3. Embed these tours in property listings
4. Allow potential buyers to explore properties virtually

## Prerequisites

Before you begin, you'll need:

- A Matterport developer account ([Sign up here](https://matterport.com/platform))
- API credentials (API key and SDK key)
- Billing information set up with Matterport

## Setup Instructions

### 1. Obtain API Credentials

1. Log in to your Matterport developer account
2. Navigate to the Developer Dashboard
3. Create a new application or use an existing one
4. Generate API keys for your application
5. Make note of your API Key and SDK Key

### 2. Configure the Homeverse Platform

1. Open `assets/js/config.js`
2. Update the Matterport API credentials:
   ```javascript
   const API_KEYS = {
     // Matterport 3D scanning API
     matterport: {
       apiKey: 'YOUR_MATTERPORT_API_KEY', // Replace with your actual key
       sdkKey: 'YOUR_MATTERPORT_SDK_KEY'  // Replace with your actual key
     },
     // Other API keys...
   };
   ```

3. Save the file

### 3. Test the Integration

1. Navigate to the 3D Models page on your Homeverse site
2. Upload a property walkthrough video (1-2 minutes in length)
3. Wait for the system to process the video and generate a 3D model
4. Verify that the 3D model appears correctly
5. Test the model viewer controls

## Video Requirements

For optimal 3D model generation, advise your users to:

- Use a modern smartphone or camera with good stabilization
- Record in landscape orientation at 1080p resolution or higher
- Maintain steady, slow movement through the property
- Ensure good lighting throughout all spaces
- Capture each room from multiple angles
- Include transitional spaces like hallways and staircases
- Avoid fast movements or abrupt transitions

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Model not generating | Check API key validity in config.js |
| Processing error | Ensure video meets requirements and try again |
| Model quality issues | Improve lighting and camera movement in video |
| Model viewer not loading | Verify internet connection and browser compatibility |

## Advanced Configuration

The Matterport integration can be further customized in the `property-3d.js` file:

- Processing options
- Model quality settings
- Viewer customization
- Webhook configuration for status updates

## Support

For technical support with the 3D model integration:

- Email: support@homeverse.example.com
- Documentation: [Matterport Developer Docs](https://matterport.com/developers)

## Pricing

Note that Matterport API usage incurs costs based on:

- Number of models processed
- Storage of 3D models
- API calls and bandwidth usage

Review the current pricing on the [Matterport pricing page](https://matterport.com/pricing).

---

Last updated: August 2023 