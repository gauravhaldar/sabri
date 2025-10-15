# Sabri API Setup Guide

## Environment Variables

Create a `.env.local` file in the `sabri` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sabri

# Firebase Configuration (get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Installation

1. Install dependencies:

```bash
cd sabri
npm install
```

2. Set up MongoDB:

- Install MongoDB locally or use MongoDB Atlas
- Update MONGODB_URI in .env.local

3. Set up Firebase:

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project or select existing
- Enable Authentication in the Firebase console
- Go to Project Settings > General > Your apps
- Add a web app and copy the configuration
- Enable Email/Password and Google sign-in methods in Authentication > Sign-in method
- Copy the config values to your .env.local file

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth login

### Usage

The frontend is already configured to use Firebase authentication. Users can:

1. Register with email/password
2. Login with email/password
3. Login with Google OAuth
4. Access protected routes with Firebase auth tokens

## Features Implemented

✅ User registration with Firebase Authentication
✅ User login with Firebase Authentication
✅ Google OAuth authentication via Firebase
✅ User profile management with MongoDB
✅ Database models with MongoDB
✅ Frontend integration with Firebase
✅ Real-time authentication state management

## Why Firebase?

- **Free**: Firebase Authentication is free for most use cases
- **Easy Setup**: Much simpler than Google Cloud Console
- **Built-in Security**: Firebase handles security best practices
- **Real-time**: Built-in real-time authentication state
- **Scalable**: Automatically scales with your app
- **Multiple Providers**: Easy to add more auth providers later
