# Authentication System Documentation

## Overview

The Pharma Plus authentication system is built with NextAuth.js, providing a secure, feature-rich user authentication experience. It includes email verification, password reset, role-based access control, and social authentication via Google.

## Features

### 1. **User Registration (Sign Up)**
- Email validation with regex pattern matching
- Strong password requirements:
  - Minimum 8 characters
  - Mix of uppercase and lowercase letters
  - At least one number
  - At least one special character (@$!%*?&)
- Password strength indicator
- Email verification required before account activation
- Rate limiting: 5 signups per hour per IP address

### 2. **User Login (Sign In)**
- Credential-based authentication
- Email/password validation
- Forgot password link
- Google OAuth integration
- Session-based authentication with JWT strategy

### 3. **Email Verification**
- Verification token sent to user's email
- Token expires after 24 hours
- User cannot sign in without email verification
- Resend verification option available

### 4. **Password Reset**
- Secure password reset flow
- Email-based reset link
- Reset tokens expire after 1 hour
- Strong password validation during reset
- Rate limiting: 5 reset attempts per hour per IP

### 5. **User Profile Management**
- View and edit profile information
- Update name, phone, and address
- Email cannot be changed (for security)
- Profile completion after signup (optional)

### 6. **Security Features**
- Password hashing with bcrypt (10 salt rounds)
- CSRF protection via NextAuth
- Rate limiting on authentication endpoints
- Secure token generation with crypto.randomBytes
- Account status tracking (active/suspended/deleted)
- Last login tracking

## Database Models

### User Schema

```typescript
{
  name: String,                           // Full name (required)
  email: String,                          // Email (required, unique)
  password: String,                       // Hashed password (required)
  phone: String,                          // Phone number (optional)
  address: String,                        // Address (optional)
  role: String,                           // 'user' or 'admin' (default: 'user')
  emailVerified: Boolean,                 // Email verification status
  emailVerificationToken: String,         // Token for email verification
  emailVerificationTokenExpiry: Date,     // Expiry time for verification token
  passwordResetToken: String,             // Token for password reset
  passwordResetTokenExpiry: Date,         // Expiry time for reset token
  lastLogin: Date,                        // Last login timestamp
  accountStatus: String,                  // 'active', 'suspended', or 'deleted'
  createdAt: Date,                        // Account creation timestamp
  updatedAt: Date,                        // Last update timestamp
}
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response (Success):**
```json
{
  "ok": true,
  "id": "user_id",
  "message": "Account created. Please verify your email to activate your account.",
  "requiresEmailVerification": true
}
```

#### POST /api/auth/verify-email
Verify user's email address.

**Query Parameters:**
- `token` (required): Email verification token

**Response:**
```json
{
  "ok": true,
  "message": "Email verified successfully! You can now sign in."
}
```

#### POST /api/auth/forgot-password
Request a password reset link.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

#### POST /api/auth/reset-password
Reset password with verification token.

**Request:**
```json
{
  "token": "reset_token",
  "password": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Password reset successfully! You can now sign in with your new password."
}
```

#### POST /api/auth/update-profile
Update user profile information (requires authentication).

**Request:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "address": "123 Main St, City"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City"
  }
}
```

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://username:password@localhost:27017/pharma-platform

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
EMAIL_SERVICE=gmail  # or another email service provider
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@pharmaplus.com
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### Setting up Email (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `EMAIL_PASSWORD`

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx          # Sign in page
│   │   ├── signup/page.tsx          # Sign up page
│   │   ├── forgot-password/page.tsx # Forgot password page
│   │   ├── reset-password/page.tsx  # Password reset page
│   │   ├── verify-email/page.tsx    # Email verification confirmation
│   │   └── verify-pending/page.tsx  # Email verification pending
│   ├── profile/page.tsx             # User profile page
│   └── api/auth/
│       ├── signup/route.ts          # Sign up endpoint
│       ├── verify-email/route.ts    # Email verification endpoint
│       ├── forgot-password/route.ts # Forgot password endpoint
│       ├── reset-password/route.ts  # Reset password endpoint
│       └── update-profile/route.ts  # Profile update endpoint
├── lib/
│   ├── validation.ts                # Form validation utilities
│   ├── email.ts                     # Email sending utilities
│   ├── rate-limit.ts                # Rate limiting utility
│   └── mongodb.ts                   # Database connection
├── models/
│   └── User.ts                      # User schema
└── auth.ts                          # NextAuth configuration
```

## Usage Examples

### Sign Up
1. Navigate to `/auth/signup`
2. Enter name, email, and strong password
3. Submit form
4. Check email for verification link
5. Click verification link
6. Redirect to sign in page
7. Sign in with email and password

### Sign In
1. Navigate to `/auth/signin`
2. Enter email and password
3. Click "Sign in"
4. Redirect to home page on success

### Reset Password
1. Navigate to `/auth/signin`
2. Click "Forgot password?"
3. Enter email address
4. Check email for reset link
5. Click reset link
6. Enter new password
7. Confirm new password
8. Redirect to sign in page
9. Sign in with new password

### View/Edit Profile
1. Must be signed in
2. Navigate to `/profile`
3. View current information
4. Click "Edit Profile"
5. Update information
6. Click "Save Changes"

## Rate Limiting

Rate limits are implemented to protect against brute force attacks:

- **Sign Up**: 5 attempts per hour per IP
- **Password Reset**: 5 attempts per hour per IP
- **Sign In**: Not rate limited (recommend adding in production)

## Security Best Practices

1. **Never commit secrets**: Use environment variables for sensitive data
2. **HTTPS in production**: Always use HTTPS in production
3. **Strong passwords**: Enforce password requirements
4. **Email verification**: Require users to verify their email
5. **Session security**: Use secure, HttpOnly cookies
6. **Token expiration**: All tokens have expiration times
7. **Input validation**: All inputs are validated server-side
8. **CSRF protection**: NextAuth handles CSRF protection

## Troubleshooting

### Email not sending
- Check email credentials in `.env.local`
- Verify Gmail app password (if using Gmail)
- Check firewall/network restrictions
- Enable "Less secure app access" (if not using app password)

### Verification token expired
- Tokens expire after 24 hours
- User should request new email (feature to be added)

### Password reset token expired
- Tokens expire after 1 hour
- User should request new reset link

### User locked out
- Wait for rate limit window to reset (1 hour)
- Or use admin panel to reset rate limits

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (GitHub, Microsoft, etc.)
- [ ] Session management dashboard
- [ ] Login activity log
- [ ] IP-based security alerts
- [ ] CAPTCHA on signup/signin
- [ ] Biometric authentication
- [ ] Account deletion workflow
- [ ] Password expiration policy
- [ ] Admin user management dashboard
