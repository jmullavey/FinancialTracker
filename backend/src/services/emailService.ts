import nodemailer from 'nodemailer';

interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  service?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Use environment variables to configure email
    const emailConfig: EmailConfig = {};

    // Check for SMTP configuration
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      emailConfig.host = process.env.SMTP_HOST;
      emailConfig.port = parseInt(process.env.SMTP_PORT || '587');
      emailConfig.secure = process.env.SMTP_SECURE === 'true';
      emailConfig.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      };
    }
    // Check for SendGrid (using SMTP)
    else if (process.env.SENDGRID_API_KEY) {
      emailConfig.service = 'SendGrid';
      emailConfig.auth = {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      };
      emailConfig.host = 'smtp.sendgrid.net';
      emailConfig.port = 587;
      emailConfig.secure = false;
    }
    // Check for Mailgun
    else if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      emailConfig.host = `smtp.mailgun.org`;
      emailConfig.port = 587;
      emailConfig.secure = false;
      emailConfig.auth = {
        user: process.env.MAILGUN_SMTP_USER || `postmaster@${process.env.MAILGUN_DOMAIN}`,
        pass: process.env.MAILGUN_API_KEY
      };
    }
    // Development/test mode - use Ethereal Email (creates test account)
    else if (process.env.NODE_ENV === 'development') {
      // For development, we'll use console logging
      console.log('[EMAIL SERVICE] Running in development mode - emails will be logged to console');
      return;
    }

    if (emailConfig.host || emailConfig.service) {
      this.transporter = nodemailer.createTransport(emailConfig);
      console.log('[EMAIL SERVICE] Email transporter initialized');
    } else {
      console.warn('[EMAIL SERVICE] No email configuration found. Email functionality will be disabled.');
    }
  }

  async sendVerificationEmail(email: string, verificationToken: string, firstName: string): Promise<boolean> {
    const appUrl = process.env.FRONTEND_URL || process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Financial Tracker" <noreply@financialtracker.com>`,
      to: email,
      subject: 'Verify Your Email Address - Financial Tracker',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Financial Tracker!</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>Thank you for registering with Financial Tracker. To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p>This verification link will expire in 24 hours.</p>
              <p>If you didn't create an account with Financial Tracker, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Financial Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${firstName},

        Thank you for registering with Financial Tracker. To complete your registration, please verify your email address by visiting this link:

        ${verificationUrl}

        This verification link will expire in 24 hours.

        If you didn't create an account with Financial Tracker, you can safely ignore this email.
      `
    };

    try {
      // In development mode without email config, just log it
      if (!this.transporter) {
        console.log('\n=== EMAIL VERIFICATION (Development Mode) ===');
        console.log('To:', email);
        console.log('Verification URL:', verificationUrl);
        console.log('===========================================\n');
        return true;
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EMAIL SERVICE] Verification email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send verification email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<boolean> {
    const appUrl = process.env.FRONTEND_URL || process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Financial Tracker" <noreply@financialtracker.com>`,
      to: email,
      subject: 'Reset Your Password - Financial Tracker',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .warning { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${firstName},</p>
              <p>We received a request to reset your password for your Financial Tracker account. Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <div class="warning">
                <p><strong>Security Notice:</strong></p>
                <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Financial Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${firstName},

        We received a request to reset your password. Please visit this link to reset it:

        ${resetUrl}

        This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
      `
    };

    try {
      if (!this.transporter) {
        console.log('\n=== PASSWORD RESET EMAIL (Development Mode) ===');
        console.log('To:', email);
        console.log('Reset URL:', resetUrl);
        console.log('===========================================\n');
        return true;
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('[EMAIL SERVICE] Password reset email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send password reset email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();

