# Vercel Deployment Guide

## Overview
This guide explains how to deploy the Pharma Platform to Vercel without server errors.

## Prerequisites
- Vercel account (vercel.com)
- GitHub repository connected to Vercel
- Google OAuth credentials updated to include your Vercel URL

## Step 1: Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build settings
3. Click "Deploy"

## Step 2: Configure Environment Variables in Vercel Dashboard

Go to **Settings → Environment Variables** and add the following:

### Required Variables
```
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-project.vercel.app
MONGODB_URI=your-mongodb-connection-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@pharmaplus.com
NODE_ENV=production
```

### Optional Variables
```
FREE_AI_API_URL=https://api-inference.huggingface.co/models/gpt2
FREE_AI_API_KEY=hf_YOUR_HUGGING_FACE_API_KEY_HERE
```

**Important:** Replace `your-project.vercel.app` with your actual Vercel deployment URL.

## Step 3: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services → OAuth consent screen**
4. Go to **Credentials → OAuth 2.0 Client IDs**
5. Edit the "Web application" credential
6. Under **Authorized redirect URIs**, add both:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-project.vercel.app/api/auth/callback/google` (for production)

7. Click **Save**

## Step 4: Redeploy

After updating environment variables in Vercel:
1. Go to **Deployments**
2. Click the latest deployment
3. Click **Redeploy**

## How It Works

### Environment Variable Resolution

The application uses this priority order for determining the authentication URL:

1. **NEXTAUTH_URL** - If explicitly set in environment variables
2. **VERCEL_URL** - Automatically available on Vercel (used in auth.ts)
3. **localhost:3000** - Default for local development

### Dynamic URL Resolution in auth.ts

```typescript
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};
```

## Testing Deployment

1. After deployment, visit your Vercel URL
2. Test the signup flow
3. Test the Google OAuth sign-up
4. After approving access, you should be redirected to the complete-profile page

## Troubleshooting

### Infinite Redirect Loop
- Verify NEXTAUTH_URL matches your Vercel deployment URL exactly
- Check that Google OAuth redirect URIs include your Vercel URL
- Clear browser cookies and try again

### OAuth Error
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Ensure the redirect URI is added in Google Cloud Console
- Check that NEXTAUTH_URL includes the protocol (https://)

### 500 Internal Server Error
- Check Vercel function logs for the actual error
- Verify all required environment variables are set
- Ensure MongoDB connection string is correct

## Development vs Production

### Local Development
- Dev server runs on http://localhost:3000
- NEXTAUTH_URL=http://localhost:3000
- Uses local environment variables from .env.local

### Vercel Production
- Deployment URL: https://your-project.vercel.app
- NEXTAUTH_URL=https://your-project.vercel.app
- Uses environment variables from Vercel dashboard
- VERCEL_URL is automatically available

## MongoDB & Email Services

Both services should work on Vercel without issues:
- **MongoDB Atlas**: Remote database (already configured)
- **Gmail SMTP**: Works with app passwords (already configured)

## Summary

The application is now configured to:
✅ Work locally on http://localhost:3000
✅ Work on Vercel with dynamic URL detection
✅ Support Google OAuth on both environments
✅ Properly redirect users after authentication
✅ No server errors due to environment mismatch
