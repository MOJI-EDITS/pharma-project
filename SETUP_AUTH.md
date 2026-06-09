# Pharma Plus Authentication System - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm install nodemailer
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in the required variables:

```bash
cp .env.example .env.local
```

### 3. Set Up MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Copy your connection string to MONGODB_URI in .env.local
```

### 4. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### 5. Set Up Email Service

#### Using Gmail

1. Enable 2-Factor Authentication: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the generated 16-character password
5. Update `.env.local`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   EMAIL_FROM=noreply@pharmaplus.com
   ```

#### Using Other Services

See [Nodemailer documentation](https://nodemailer.com/smtp/) for other email providers.

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Features Walkthrough

### Create Account

1. Visit http://localhost:3000/auth/signup
2. Enter name, email, strong password
3. Submit form
4. Check email for verification link (printed in console in dev)
5. Click verification link
6. You'll be redirected to sign in page

### Sign In

1. Visit http://localhost:3000/auth/signin
2. Enter email and password
3. Click "Sign in"
4. Redirected to home page

### Forgot Password

1. Visit http://localhost:3000/auth/signin
2. Click "Forgot password?"
3. Enter email address
4. Check email for reset link
5. Click link and enter new password
6. Sign in with new password

### View/Edit Profile

1. Sign in to your account
2. Visit http://localhost:3000/profile
3. Click "Edit Profile" to update information
4. Email cannot be changed for security reasons

### Sign Out

1. Visit http://localhost:3000/profile
2. Click "Sign Out" button

## Testing

### Test Email in Development

Emails are logged to the console in development mode. Look for the verification and reset links in your terminal output.

### Test Users

Create test accounts with:
- Strong passwords (8+ chars, mixed case, number, special char)
- Real email addresses (or use MailHog for local testing)
- Different user roles (regular users and admins)

### Test Rate Limiting

Try signing up more than 5 times within an hour from the same IP to see rate limiting in action.

## File Locations

### Key Files to Understand

- **Auth Config**: `auth.ts` - NextAuth configuration
- **Sign In Page**: `src/app/auth/signin/page.tsx`
- **Sign Up Page**: `src/app/auth/signup/page.tsx`
- **Password Reset**: `src/app/auth/forgot-password/page.tsx` + `reset-password/page.tsx`
- **Email Verification**: `src/app/auth/verify-email/page.tsx`
- **Profile Page**: `src/app/profile/page.tsx`
- **API Endpoints**: `src/app/api/auth/*`
- **Database Model**: `src/models/User.ts`
- **Utilities**: 
  - `src/lib/validation.ts` - Form validation
  - `src/lib/email.ts` - Email templates and sending
  - `src/lib/rate-limit.ts` - Rate limiting
- **Documentation**: `AUTH_SYSTEM.md` - Complete API documentation

## Customization

### Change Branding

Edit `/auth/` pages to change:
- Logo (replace "P" with your logo)
- Colors (change `#2563eb` to your brand color)
- Email templates in `src/lib/email.ts`
- Company name "Pharma Plus"

### Adjust Rate Limiting

Edit `src/lib/rate-limit.ts`:
```typescript
rateLimit(ip, { 
  interval: 60 * 60 * 1000,  // 1 hour
  maxRequests: 5              // 5 attempts
});
```

### Change Password Requirements

Edit `src/lib/validation.ts`:
```typescript
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### Customize Email Templates

Edit `src/lib/email.ts`:
- `getVerificationEmailTemplate()`
- `getPasswordResetEmailTemplate()`
- `getWelcomeEmailTemplate()`

## Security Checklist

- [ ] Change `NEXTAUTH_SECRET` to a long, random string
- [ ] Use HTTPS in production (set `NEXTAUTH_URL` to https)
- [ ] Configure email service with production credentials
- [ ] Test email sending before deploying
- [ ] Set up MongoDB in production (not local)
- [ ] Enable Google OAuth with production URLs
- [ ] Review and adjust rate limiting for production
- [ ] Set up backup and recovery procedures
- [ ] Monitor authentication logs
- [ ] Implement additional security measures (2FA, CAPTCHA, etc.)

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub first
git push origin main

# Deploy to Vercel
vercel
```

Then set environment variables in Vercel dashboard:
- MONGODB_URI
- NEXTAUTH_SECRET (use `openssl rand -base64 32`)
- NEXTAUTH_URL (your production domain)
- GOOGLE_CLIENT_ID / SECRET
- EMAIL_* variables

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm start
```

### Environment Variables for Production

```env
# Change to production domain
NEXTAUTH_URL=https://your-domain.com

# Use strong secret
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Use production MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharma

# Production email credentials
EMAIL_USER=noreply@your-domain.com
EMAIL_PASSWORD=<your-production-app-password>

# Etc...
```

## Troubleshooting

### Email not sending

1. Check email credentials
2. Verify EMAIL_USER and EMAIL_PASSWORD are correct
3. Check EMAIL_SERVICE is set correctly
4. For Gmail, verify you're using App Password (not actual password)
5. Check firewall/network allows SMTP connections

### Database connection error

1. Verify MONGODB_URI is correct
2. Check MongoDB server is running (locally)
3. Verify network access (for MongoDB Atlas)
4. Check username/password in connection string

### NextAuth errors

1. Check NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches your domain
3. Clear `.next` folder and rebuild
4. Check browser cookies aren't blocking sessions

### Verification token expired

- Tokens expire after 24 hours
- Feature to resend verification email coming soon

### Rate limiting too strict

- Increase `maxRequests` in `src/lib/rate-limit.ts`
- Or increase `interval` time window

## Support & Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## License

Pharma Plus Authentication System is part of the Pharma Plus project.

---

**Last Updated**: June 8, 2026
**Version**: 1.0.0
