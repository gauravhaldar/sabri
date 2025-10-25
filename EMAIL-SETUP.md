# Email Configuration for Sabri Jewelry
# Add these variables to your .env.local file

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Alternative SMTP providers:
# For Outlook/Hotmail:
# SMTP_HOST=smtp-mail.outlook.com
# SMTP_PORT=587

# For Yahoo:
# SMTP_HOST=smtp.mail.yahoo.com
# SMTP_PORT=587

# For custom SMTP:
# SMTP_HOST=your-smtp-server.com
# SMTP_PORT=587

# Admin email (where order notifications will be sent)
ADMIN_EMAIL=haldarainit@gmail.com

# Instructions for Gmail setup:
# 1. Enable 2-factor authentication on your Gmail account
# 2. Generate an App Password:
#    - Go to Google Account settings
#    - Security > 2-Step Verification > App passwords
#    - Generate a password for "Mail"
#    - Use this password as SMTP_PASS
# 3. Make sure "Less secure app access" is enabled (if using regular password)
