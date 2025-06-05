# Cloud Storage Project

## Overview
This project provides a backend API and a frontend web interface to upload, manage, and download files and folders, simulating an online cloud storage for your 16GB memory device.

## Setup Instructions

### Backend
1. Make sure you have Node.js installed.
2. Navigate to the backend folder:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. The backend server will start on port 3000 (or as set in environment variable).

### Frontend
1. Open `index.html` in your browser or deploy it on a static web host like GitHub Pages.
2. Update frontend API URLs to point to your backend server URL (e.g., `http://localhost:3000/api`).

### Deployment
- You can deploy backend on [Render.com](https://render.com) by connecting your GitHub repo and setting up a Node.js web service.
- Frontend can be deployed on GitHub Pages or any static hosting.

## Features
- Upload multiple files and create/delete folders
- View small previews of files and folders
- Copy, move, delete, share files and folders
- Download files from anywhere

## Notes
- Backend stores files in the `storage` directory.
- Ensure your backend and frontend communicate via correct API endpoints.
