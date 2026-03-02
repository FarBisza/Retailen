# Retailen Store - Frontend Application

This repository contains the React frontend application for the Retailen ecosystem, designed specifically to interface with the .NET Core backend API. 

## Technology Stack
- **Framework**: React 19 / Vite
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Analytics**: PowerBI Client React

## Run Locally

**Prerequisites:** Node.js (v18 or higher recommended)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server (Hot-Reload enabled):
   ```bash
   npm run dev
   ```

3. To build for production deployment:
   ```bash
   npm run build
   ```

## Integration
Ensure that the backend `.NET Core API` is running securely (typically on `http://localhost:5200` locally) as this client application will send HTTP requests to those endpoints.
