# Email Verification Setup Guide

## Overview

Email verification has been successfully implemented in the Financial Tracker application. Users must verify their email address after registration (optional - can be configured to require verification for login).

## Features

✅ **Email Verification on Registration**
- New users receive a verification email upon registration
- Verification token expires after 24 hours
- Users can resend verification emails

✅ **Email Verification Page**
- Beautiful UI for verifying email addresses
- Resend verification email functionality
- Clear error messages

✅ **Optional Login Requirement**
- Can be configured to require email verification before login
- Configurable via `REQUIRE_EMAIL_VERIFICATION` environment variable

## Backend Implementation

### New Routes

1. **GET `/api/auth/verify-email?token=<token>`**
   - Verifies email address using token from email link
   - Returns success message

2. **POST `/api/auth/resend-verification`**
   - Resends verification email to user
   - Body: `{ "email": "user@example.com" }`

### Updated Routes

1. **POST `/api/auth/register`**
   - Now sends verification email automatically
   - Returns `requiresVerification: true` and `emailSent: true`
   - No longer returns JWT token (user must verify first)

2. **POST `/api/auth/login`**
   - Checks if email is verified (if `REQUIRE_EMAIL_VERIFICATION=true`)
   - Returns `emailVerified` status in response

3. **GET `/api/auth/me`**
   - Returns `emailVerified` status in user object

### Email Service

The email service supports multiple providers:

1. **SMTP** (Gmail, Outlook, custom SMTP)
2. **SendGrid** (via API key)
3. **Mailgun** (via API key)
4. **Development Mode** (logs to console)

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:3000

# Email Configuration - Option 1: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Configuration - Option 2: SendGrid
# SENDGRID_API_KEY=your-sendgrid-api-key

# Email Configuration - Option 3: Mailgun
# MAILGUN_API_KEY=your-mailgun-api-key
# MAILGUN_DOMAIN=your-mailgun-domain.com
# MAILGUN_SMTP_USER=postmaster@your-mailgun-domain.com

# Email Settings
EMAIL_FROM="Financial Tracker" <noreply@financialtracker.com>
REQUIRE_EMAIL_VERIFICATION=false  # Set to 'true' to require verification for login
```

### Setting Up Email Providers

#### Gmail (SMTP)

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password:
   - Go to Google Account → Security → App passwords
   - Generate password for "Mail"
   - Use this password in `SMTP_PASS`

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

#### SendGrid

1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to `.env`:

```bash
SENDGRID_API_KEY=SG.your-api-key-here
```

#### Mailgun

1. Sign up at https://mailgun.com
2. Verify your domain
3. Get your API key and domain
4. Add to `.env`:

```bash
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
MAILGUN_SMTP_USER=postmaster@your-mailgun-domain.com
```

#### Development Mode

If no email configuration is provided and `NODE_ENV=development`, emails will be logged to the console instead of being sent. This is perfect for local development.

## Frontend Implementation

### New Pages

1. **VerifyEmailPage** (`/verify-email`)
   - Handles email verification via token
   - Allows resending verification emails
   - Shows success/error states

### Updated Pages

1. **RegisterPage**
   - Shows message about email verification after registration
   - Redirects to verification page if needed

2. **LoginPage**
   - Handles email verification errors
   - Redirects to verification page if email not verified

### Updated Context

- `AuthContext` now includes:
  - `resendVerificationEmail(email: string)`
  - `verifyEmail(token: string)`
  - Updated `register()` to return verification status
  - Updated `login()` to handle verification errors

## User Flow

### Registration Flow

1. User registers → Account created
2. Verification email sent automatically
3. User redirected to `/verify-email` page
4. User clicks link in email → Email verified
5. User can now log in

### Login Flow (if verification required)

1. User tries to log in
2. If email not verified → Error shown
3. User redirected to `/verify-email` page
4. User can resend verification email

### Resend Verification

1. User visits `/verify-email` page
2. Enters email address
3. Clicks "Resend Verification Email"
4. New verification email sent

## Testing

### Development Mode

1. Start the application
2. Register a new user
3. Check console logs for verification email content
4. Copy verification URL from console
5. Visit URL in browser or use API directly

### Production Mode

1. Configure email provider (SMTP/SendGrid/Mailgun)
2. Register a new user
3. Check email inbox for verification email
4. Click verification link
5. Verify email is marked as verified

## Security Considerations

✅ **Secure Token Generation**
- Uses `crypto.randomBytes(32)` for secure tokens
- Tokens are 64-character hex strings

✅ **Token Expiration**
- Verification tokens expire after 24 hours
- Expired tokens are rejected

✅ **Rate Limiting**
- Resend verification endpoint is rate-limited
- Prevents abuse

✅ **Security Logging**
- Email verification events are logged
- Helps track security events

## Troubleshooting

### Email Not Sending

1. **Check Configuration**
   - Verify all email environment variables are set
   - Check SMTP credentials are correct

2. **Check Logs**
   - Look for email service errors in console
   - Check if email service initialized correctly

3. **Development Mode**
   - In development, emails are logged to console
   - Check console for verification URLs

### Verification Link Not Working

1. **Check Token Expiration**
   - Tokens expire after 24 hours
   - Request a new verification email

2. **Check URL Format**
   - Should be: `/verify-email?token=<64-char-token>`
   - Token must match exactly

3. **Check Backend Logs**
   - Verify token is being received
   - Check for errors in verification process

### Email Goes to Spam

1. **Configure SPF/DKIM Records**
   - Set up proper DNS records for your domain
   - Required for production email delivery

2. **Use Reputable Email Service**
   - SendGrid and Mailgun have better deliverability
   - Gmail SMTP may have rate limits

3. **Check Email Content**
   - Avoid spam trigger words
   - Include proper headers

## Next Steps

1. **Configure Email Provider**
   - Choose SMTP, SendGrid, or Mailgun
   - Add credentials to environment variables

2. **Set Frontend URL**
   - Update `FRONTEND_URL` to your production domain
   - Ensures verification links work correctly

3. **Optional: Require Verification**
   - Set `REQUIRE_EMAIL_VERIFICATION=true` to require verification for login
   - Users must verify before accessing the app

4. **Customize Email Templates**
   - Edit `backend/src/services/emailService.ts`
   - Customize HTML email templates

## Support

For issues or questions:
- Check backend logs for email service errors
- Verify environment variables are set correctly
- Test in development mode first (console logging)

