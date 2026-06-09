# QUICK SETUP CHECKLIST - Pharma Plus Authentication

## ✅ Completed
- [x] Build production version - no errors
- [x] MongoDB Atlas already configured
- [x] NEXTAUTH_SECRET generated
- [x] `.env.local` updated with email & OAuth placeholders

## 📋 TO DO - Fill in These Values

### 1. Gmail Configuration (2-3 minutes)
- [ ] Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- [ ] Select "Mail" and "Windows Computer"
- [ ] Copy the 16-character password
- [ ] In `.env.local`, replace `EMAIL_USER` with your Gmail
- [ ] In `.env.local`, replace `EMAIL_PASSWORD` with the 16-char password

**Result:** Your email will be: `your-email@gmail.com`

### 2. Google OAuth Setup (5-10 minutes)
- [ ] Go to [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create new project named "Pharma Plus"
- [ ] Enable "Google+ API"
- [ ] Go to Credentials → Create OAuth 2.0 Client ID
- [ ] Choose "Web application"
- [ ] Add Authorized Redirect URI:
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- [ ] Copy Client ID → paste in `.env.local` as `GOOGLE_CLIENT_ID`
- [ ] Copy Client Secret → paste in `.env.local` as `GOOGLE_CLIENT_SECRET`

### 3. Restart Dev Server
```bash
npm run dev
```
Server will reload with new configuration

## ✅ Testing the System

### Test Email Verification
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in form with test data:
   - Name: "Test User"
   - Email: Your Gmail address
   - Password: "TestPassword123!"
4. Click "Create account"
5. Check your Gmail inbox for verification email
6. Click the verification link to verify

### Test Password Reset
1. Go to http://localhost:3000/auth/signin
2. Click "Forgot password?"
3. Enter your Gmail address
4. Check inbox for reset link
5. Click link and set new password
6. Sign in with new password

### Test Google OAuth
1. Go to http://localhost:3000/auth/signup
2. Click "Sign up with Google"
3. Select your Google account
4. Verify account is created

## 📱 Database Status
Your MongoDB Atlas connection is already working:
- **Database:** pharma-platform
- **User:** moiz89gondal_db_user
- **Status:** ✅ Ready to receive data

## 🚀 What Happens Next
1. You fill in Gmail & Google OAuth credentials above
2. You restart `npm run dev`
3. System sends real verification & reset emails
4. User accounts are saved to your MongoDB database
5. Everything is production-ready!

## ⚠️ Important Notes
- **Never commit `.env.local`** to git
- **Never share** GOOGLE_CLIENT_SECRET or EMAIL_PASSWORD
- For production, update all variables for your domain

## 📚 Full Documentation
- [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md) - Step-by-step guide for each service
- [AUTH_SYSTEM.md](AUTH_SYSTEM.md) - Complete API documentation
- [SETUP_AUTH.md](SETUP_AUTH.md) - Setup guide with examples

---

**Questions?** Check the detailed documentation files above.

**Ready to proceed?** Fill in the values above and restart the dev server!
