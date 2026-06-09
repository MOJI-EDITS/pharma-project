import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email service not configured');
      return false;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      ...options,
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export function getVerificationEmailTemplate(verificationLink: string, userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Pharma Plus</h1>
      </div>
      <div style="background-color: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2>Verify Your Email Address</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for creating a Pharma Plus account. Please verify your email address to get started.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}

export function getPasswordResetEmailTemplate(resetLink: string, userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Pharma Plus</h1>
      </div>
      <div style="background-color: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2>Reset Your Password</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}

export function getWelcomeEmailTemplate(userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Welcome to Pharma Plus</h1>
      </div>
      <div style="background-color: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2>Welcome, ${userName}!</h2>
        <p>Your account has been successfully created. You can now shop from our wide range of pharmaceutical products.</p>
        <h3>What you can do:</h3>
        <ul>
          <li>Browse and order medicines</li>
          <li>Upload prescriptions</li>
          <li>Track your orders</li>
          <li>Save your favorite products</li>
          <li>Get personalized health recommendations</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Best regards,<br>The Pharma Plus Team</p>
      </div>
    </div>
  `;
}
