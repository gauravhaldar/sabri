# Gmail Authentication Troubleshooting Guide

## Current Issue
Gmail is rejecting the App Password with error: "Username and Password not accepted"

## Solution 1: Verify Gmail Settings

### Step 1: Check 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Ensure "2-Step Verification" is **ENABLED**
3. If not enabled, enable it first

### Step 2: Generate New App Password
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Scroll down to "App passwords"
4. Select "Mail" from dropdown
5. Click "Generate"
6. Copy the 16-character password (no spaces)

### Step 3: Update .env File
Replace your current SMTP_PASS with the new App Password:
```env
SMTP_PASS=your-new-16-character-password
```

## Solution 2: Alternative Email Providers

### Option A: Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-outlook-email@outlook.com
SMTP_PASS=your-outlook-password
```

### Option B: Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-yahoo-email@yahoo.com
SMTP_PASS=your-yahoo-app-password
```

### Option C: Custom SMTP Service
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Solution 3: Test Without Authentication (Development Only)

For testing purposes, you can use a service like Mailtrap or Ethereal Email:

### Using Ethereal Email (Free Testing)
```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=ethereal.user@ethereal.email
SMTP_PASS=ethereal.pass
```

## Solution 4: Debug Steps

1. **Check App Password Format**: No spaces, exactly 16 characters
2. **Verify Email Address**: Must match the Gmail account
3. **Check Account Security**: Ensure no security alerts
4. **Try Different Port**: Use port 465 with secure: true

## Quick Fix Commands

### Test with Ethereal Email (No Auth Required)
```bash
# This will work immediately for testing
node test-ethereal.js
```

### Test with Updated Gmail Settings
```bash
# After updating .env with new App Password
node test-email.js
```

## Next Steps
1. Try generating a new Gmail App Password
2. If that fails, use Ethereal Email for testing
3. For production, consider using a dedicated email service like SendGrid or Mailgun
