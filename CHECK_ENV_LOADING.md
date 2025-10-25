# 🔍 Debugging: Email Works in Test but Not in Real Orders

## ✅ What We Know:
- Test script sends email successfully ✅
- Real orders don't send emails ❌

## 🐛 Most Common Cause:

**Next.js development server not restarted after adding `.env` variables**

## 🚀 Solution Steps:

### Step 1: Completely Stop Your Server

In your terminal running `npm run dev`:
1. Press `Ctrl+C` to stop it
2. Wait for it to fully stop
3. Close the terminal if necessary

### Step 2: Restart Fresh

```bash
# Navigate to frontend directory
cd c:\Users\rajee\OneDrive\Desktop\sabri\frontend

# Start the server
npm run dev
```

### Step 3: Verify Environment Variables Are Loaded

When the server starts, you should see:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

### Step 4: Place a Test Order

When you place an order, watch the terminal console for these messages:

**✅ SUCCESS - You should see:**
```
Email Configuration: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'haldarainit@gmail.com',
  hasPassword: true
}
Attempting to send email to: haldarainit@gmail.com
✅ Order notification email sent successfully: <message-id>
```

**❌ PROBLEM - If you see:**
```
Email Configuration: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'your-email@gmail.com',  ← Placeholder!
  hasPassword: false  ← Not loaded!
}
```

This means the `.env` file is NOT being loaded.

## 🔧 If Still Not Working:

### Option 1: Create `.env.local` (Recommended)

Next.js prioritizes `.env.local` over `.env` for local development.

Create `c:\Users\rajee\OneDrive\Desktop\sabri\frontend\.env.local`:

```env
# Copy your SMTP settings from .env to here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=haldarainit@gmail.com
SMTP_PASS=mpaqinfhcglmvnet
ADMIN_EMAIL=haldarainit@gmail.com
```

Then restart the server.

### Option 2: Check for .env.development

If you have a `.env.development` file, it might be overriding `.env`.

### Option 3: Verify .env File Location

Make sure `.env` is in the `frontend` folder, not in the parent directory.

```
sabri/
  frontend/
    .env  ← Must be here
    package.json
    next.config.mjs
```

## 📋 Quick Checklist:

- [ ] `.env` file exists in `frontend/` directory
- [ ] `.env` contains correct SMTP credentials
- [ ] Development server was COMPLETELY restarted after adding env vars
- [ ] Console shows "hasPassword: true" when order is placed
- [ ] No error messages in console about email

## 🧪 Test Again:

1. Restart server completely
2. Place a test order
3. **Look at terminal console** (not browser console)
4. Check for the "Email Configuration" log
5. Check for "✅ Order notification email sent successfully"

## 📧 Alternative: Create .env.local

If `.env` still doesn't work, create `.env.local` with your SMTP credentials:

```bash
# In frontend directory
echo SMTP_HOST=smtp.gmail.com >> .env.local
echo SMTP_PORT=587 >> .env.local
echo SMTP_USER=haldarainit@gmail.com >> .env.local
echo SMTP_PASS=mpaqinfhcglmvnet >> .env.local
echo ADMIN_EMAIL=haldarainit@gmail.com >> .env.local
```

Then restart server and test.

## 🎯 Key Point:

The test script works because we explicitly loaded `.env` with `dotenv.config()`. 
Next.js should load it automatically, but **ONLY if the server is restarted** after the env file is created/modified.
