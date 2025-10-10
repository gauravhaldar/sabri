# Sabri Jewelry App Setup

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sabri-jewelry

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Firebase (if using Firebase auth)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-app-id

# Google OAuth (if using Google auth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env.local` file
3. Run the seed script to add sample products:

```bash
node scripts/seedProducts.js
```

## Running the Application

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## What's Fixed

The app now uses its own database instead of trying to connect to an external backend. All product API routes have been updated to:

- Use the local MongoDB database
- Query products directly from the Product model
- Return proper JSON responses
- Handle errors gracefully

The frontend will now display real products from the database instead of static mock data.

