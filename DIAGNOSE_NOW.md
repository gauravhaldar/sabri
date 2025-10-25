# 🔍 DIAGNOSE EMAIL ISSUE - Follow These Steps

## Step 1: STOP Your Dev Server Completely

In your terminal where `npm run dev` is running:
1. Press `Ctrl+C`
2. Wait for it to stop completely
3. Make sure it says "Server stopped" or similar

## Step 2: START Dev Server Fresh

```bash
npm run dev
```

Wait for:
```
✓ Ready in X.Xs
```

## Step 3: Place a Test Order

Go to your website and place an order.

## Step 4: Check Terminal Console Output

When the order is placed, you should see this in your terminal:

### ✅ GOOD - Environment Variables Loaded:
```
═══════════════════════════════════════
📧 ATTEMPTING TO SEND ORDER EMAIL
═══════════════════════════════════════
Order ID: SAB000123
Admin Email: haldarainit@gmail.com
SMTP User: haldarainit@gmail.com
SMTP Pass: ✅ SET
═══════════════════════════════════════

Email Configuration: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'haldarainit@gmail.com',
  hasPassword: true
}
✅ Order notification email sent successfully
```

### ❌ BAD - Environment Variables NOT Loaded:
```
═══════════════════════════════════════
📧 ATTEMPTING TO SEND ORDER EMAIL
═══════════════════════════════════════
Order ID: SAB000123
Admin Email: NOT SET ❌
SMTP User: NOT SET ❌
SMTP Pass: ❌ NOT SET
═══════════════════════════════════════

Email Configuration: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'your-email@gmail.com',  ← PLACEHOLDER!
  hasPassword: false  ← NOT LOADED!
}
❌ Error: Invalid login
```

## 🔧 If You See "NOT SET ❌":

### Solution: Create .env.local File

Windows PowerShell:
```powershell
cd c:\Users\rajee\OneDrive\Desktop\sabri\frontend

@"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=haldarainit@gmail.com
SMTP_PASS=mpaqinfhcglmvnet
ADMIN_EMAIL=haldarainit@gmail.com
"@ | Out-File -FilePath .env.local -Encoding UTF8
```

Or manually create the file:
1. Open Notepad
2. Paste this:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=haldarainit@gmail.com
SMTP_PASS=mpaqinfhcglmvnet
ADMIN_EMAIL=haldarainit@gmail.com
```
3. Save as: `c:\Users\rajee\OneDrive\Desktop\sabri\frontend\.env.local`
4. Make sure "Save as type" is "All Files" (not .txt)

### Then Restart Server Again:

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 📊 Quick Debug Summary:

| Symptom | Cause | Fix |
|---------|-------|-----|
| "NOT SET ❌" in logs | .env not loaded | Create .env.local |
| "hasPassword: false" | Password not found | Add to .env.local |
| "Invalid login" | Using wrong password | Use App Password |
| No email logs at all | Server not restarted | Restart completely |

## 🎯 Key Points:

1. **Test script works** because it explicitly loads `.env`
2. **Next.js needs restart** to load environment variables
3. **`.env.local` is preferred** for Next.js local development
4. **Check terminal console**, not browser console

## ✅ Success Indicators:

When it works, you'll see:
- ✅ All environment variables show actual values
- ✅ "hasPassword: true" in logs
- ✅ "Email sent successfully" message
- ✅ Email arrives in haldarainit@gmail.com inbox

## 📝 Copy This Command:

To quickly create .env.local with your credentials:

```bash
echo SMTP_HOST=smtp.gmail.com > .env.local && echo SMTP_PORT=587 >> .env.local && echo SMTP_USER=haldarainit@gmail.com >> .env.local && echo SMTP_PASS=mpaqinfhcglmvnet >> .env.local && echo ADMIN_EMAIL=haldarainit@gmail.com >> .env.local
```

Then restart: `npm run dev`
