# Pharma Plus - Deployment & Configuration Setup

## Step 1: MongoDB Atlas Setup (Cloud Database)

### Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Click "Start Free" 
3. Sign up with email/Google

### Create Cluster
1. Create a new cluster (free tier M0)
2. Choose AWS, region closest to you
3. Wait for cluster to be created (5-10 minutes)

### Get Connection String
1. Click "Database" → "Connect"
2. Click "Drivers" → "Node.js" → "3.12 or later"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `pharma-platform`

**Example:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pharma-platform?retryWrites=true&w=majority
```

### Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Choose "Password" authentication
3. Set username and strong password
4. Choose "Built-in Role" → "readWriteAnyDatabase"
5. Click "Add User"

### Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (for development)
4. Click "Confirm"

---

## Step 2: Gmail App Password Setup

### Enable 2-Factor Authentication
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" (left sidebar)
3. Enable "2-Step Verification" if not already enabled

### Create App Password
1. Go back to Security page
2. Find "App passwords" (appears only after 2FA is enabled)
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Copy this password (you'll use it in `.env.local`)

**Important:** This is NOT your Gmail password - it's a special app-specific password

---

## Step 3: Google OAuth Setup

### Create OAuth Credentials
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (name: "Pharma Plus")
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

**Optional:** For production, you'll need your actual domain

---

## Step 4: Generate NEXTAUTH_SECRET

Run this command in terminal:
```bash
openssl rand -base64 32
```

Save the output - you'll use it in `.env.local`

**On Windows (if openssl not available):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
```

---

## Step 5: Create .env.local File

Create a new file `.env.local` in the project root with your actual values:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pharma-platform?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@pharmaplus.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Step 6: Verify Configuration

### Test Database Connection
```bash
npm run dev
```

The app should start without connection errors.

### Test Email
1. Sign up with a test email
2. Check your inbox for verification email
3. Click the verification link

### Test Google OAuth
1. Click "Sign up with Google"
2. You should be redirected to Google login
3. After authentication, account should be created

---

## Step 7: Create Test User (Optional)

To create a test admin user manually via MongoDB:

1. In MongoDB Atlas, go to "Database" → "Collections"
2. Create a new collection: `users`
3. Insert a test document:

```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "$2a$10$...", // hashed password
  "role": "admin",
  "emailVerified": true,
  "createdAt": "2026-06-08T00:00:00.000Z"
}
```

Or use this test account via signup after you've configured email.

---

## Common Issues & Solutions

### "MongoDB connection failed"
- Check your connection string in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

### "Verification email not received"
- Check spam folder
- Verify Gmail app password is correct (not your main password)
- Ensure 2FA is enabled on Gmail account

### "Google OAuth not working"
- Verify redirect URIs match exactly (including http vs https)
- Check Client ID and Secret in `.env.local`
- Clear browser cookies and try again

### "NEXTAUTH_SECRET error"
- Generate new secret with openssl command
- Restart dev server after updating `.env.local`

---

## Next: Production Deployment

Once development testing is complete:

1. Deploy to Vercel (recommended)
2. Update environment variables on Vercel dashboard
3. Update Google OAuth redirect URI to production domain
4. Update NEXTAUTH_URL to production domain

See [SETUP_AUTH.md](SETUP_AUTH.md) for detailed production deployment steps.
