# JWT Authentication Setup for Sabri

## Environment Variables

Create a `.env.local` file in the `sabri` directory with the following content:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sabri

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# Google OAuth (for Google Sign-in)
GOOGLE_CLIENT_ID=AIzaSyCW2pYuxxAzam3VZekIvpo9QOjRefJh_GE
NEXT_PUBLIC_GOOGLE_CLIENT_ID=AIzaSyCW2pYuxxAzam3VZekIvpo9QOjRefJh_GE
```

## Installation

1. **Install Dependencies:**

   ```bash
   cd sabri
   npm install
   ```

2. **Set up MongoDB:**

   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGODB_URI in .env.local

3. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project: **sabri-login**
   - Go to **APIs & Services** → **Credentials**
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized origins:
     - `http://localhost:3000` (development)
     - Your production domain
   - Copy the Client ID to your .env.local

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/google` - Google OAuth login

### Usage

The frontend is already configured to use these API endpoints. Users can:

1. Register with email/password
2. Login with email/password
3. Login with Google OAuth
4. Access protected routes with JWT tokens

## Features Implemented

✅ **JWT-based Authentication** - Similar to your existing sabri-backend  
✅ **Email/Password Authentication** - Secure password hashing with bcrypt  
✅ **Google OAuth Integration** - Using Google Auth Library  
✅ **User Profile Management** - Complete user data management  
✅ **Database Models** - MongoDB with Mongoose  
✅ **Frontend Integration** - React components with authentication  
✅ **Token Management** - HTTP-only cookies and localStorage  
✅ **Role-based Access** - User and admin roles

## Authentication Flow

1. **Registration/Login**: User provides credentials
2. **JWT Generation**: Server creates JWT token with user ID
3. **Token Storage**: Token stored in HTTP-only cookie and localStorage
4. **Protected Routes**: Token verified on each request
5. **User Data**: Retrieved from MongoDB using JWT payload

## Google OAuth Flow

1. **Frontend**: Loads Google OAuth script
2. **User Interaction**: Clicks Google sign-in button
3. **Google Popup**: Google authentication popup appears
4. **Token Exchange**: Frontend sends Google token to backend
5. **Backend Verification**: Verifies Google token with Google API
6. **User Creation/Login**: Creates or logs in user
7. **JWT Generation**: Creates JWT token for session

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Token Expiration**: Configurable token expiry
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for security

## Testing

1. **Start the Application:**

   ```bash
   npm run dev
   ```

2. **Test Authentication:**
   - Visit `http://localhost:3000/login`
   - Try registering with email/password
   - Try logging in with Google
   - Check MongoDB to see registered users

The authentication system is now fully functional with JWT tokens and Google OAuth integration!
