# Firebase Setup for Sabri

## Step 1: Create .env.local file

Create a `.env.local` file in the `sabri` directory with the following content:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sabri

# Firebase Configuration (Your Project: sabri-login)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCW2pYuxxAzam3VZekIvpo9QOjRefJh_GE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sabri-login.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sabri-login
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sabri-login.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=50642717929
NEXT_PUBLIC_FIREBASE_APP_ID=1:50642717929:web:0b5ae81cb77f4a7b683478
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-F996MEE4EH
```

## Step 2: Enable Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sabri-login**
3. Go to **Authentication** in the left sidebar
4. Click **Get Started**
5. Go to **Sign-in method** tab
6. Enable the following providers:
   - **Email/Password** (enable)
   - **Google** (enable and configure)

## Step 3: Configure Google Sign-in

1. In the **Sign-in method** tab, click on **Google**
2. Toggle **Enable**
3. Add your project support email
4. Save the configuration

## Step 4: Install Dependencies

```bash
cd sabri
npm install
```

## Step 5: Start the Application

```bash
npm run dev
```

## Your Firebase Project Details

- **Project ID**: sabri-login
- **Auth Domain**: sabri-login.firebaseapp.com
- **Storage Bucket**: sabri-login.firebasestorage.app

## Features Ready to Use

✅ Email/Password Authentication
✅ Google OAuth Authentication
✅ User Registration
✅ User Login
✅ User Logout
✅ Real-time Authentication State
✅ MongoDB Integration for User Profiles

## Testing

1. Visit `http://localhost:3000/login`
2. Try registering with email/password
3. Try logging in with Google
4. Check Firebase Console to see registered users

The authentication system is now fully configured with your Firebase project!
