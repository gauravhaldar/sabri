import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import nodemailer from "nodemailer";

// Function to get email configuration
const getEmailConfig = () => {
    return {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || "your-email@gmail.com",
            pass: process.env.SMTP_PASS || "your-app-password",
        },
    };
};

export async function POST(request) {
    try {
        await connectDB();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if email exists or not for security
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, you will receive a password reset link.",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Save token to user
        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Send email
        const transporter = nodemailer.createTransport(getEmailConfig());
        const emailConfig = getEmailConfig();

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password - Sabri Jewelry</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 20px; text-align: center; }
          .header-title { color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background-color: #1a1a1a; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { padding: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
          .warning { background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 2px;">SABRI JEWELRY</h1>
            <p class="header-title">🔐 Password Reset Request</p>
          </div>
          
          <div class="content">
            <h2 style="margin-top: 0;">Hello ${user.firstName || "there"},</h2>
            <p>We received a request to reset your password for your Sabri Jewelry account.</p>
            <p>Click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button" style="color: #ffffff;">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>⏰ This link will expire in 1 hour.</strong>
              <p style="margin: 5px 0 0 0;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            
            <p style="font-size: 12px; color: #666;">If the button above does not work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; color: #007bff; word-break: break-all;">${resetUrl}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email from Sabri Jewelry.</p>
            <p>© 2024 Sabri Jewelry. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        const mailOptions = {
            from: `"Sabri Jewelry" <${emailConfig.auth.user}>`,
            to: email,
            subject: "🔐 Reset Your Password - Sabri Jewelry",
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent to:", email);

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, you will receive a password reset link.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send reset email. Please try again." },
            { status: 500 }
        );
    }
}
