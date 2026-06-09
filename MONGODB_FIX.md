# MongoDB Atlas Connection Fix

## Issue: ECONNREFUSED _mongodb._tcp.pharma-platform.flrmgs0.mongodb.net

This error means MongoDB Atlas is rejecting the connection, usually because:
1. Your IP address is not whitelisted
2. Network access settings need adjustment

## Quick Fix (5 minutes)

### Step 1: Add Your IP to MongoDB Atlas
1. Log in to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Go to your **Pharma Platform** cluster
3. Click **Network Access** (in left sidebar)
4. Click **"+ Add IP Address"**
5. Choose **"Allow Access from Anywhere"** 
   - (For development only - use specific IPs in production)
6. Click **"Confirm"**

### Step 2: Verify Connection String
1. Go back to cluster main page
2. Click **"Connect"**
3. Click **"Drivers"** → **"Node.js"** → **"3.12 or later"**
4. Copy the connection string
5. Verify it matches in `.env.local`:
   ```
   mongodb+srv://moiz89gondal_db_user:4ZRANhNggdqjmm3M@pharma-platform.flrmgs0.mongodb.net/pharma-platform?retryWrites=true&w=majority
   ```

**Important:** 
- Database name should be `pharma-platform` (not the default)
- Replace `<password>` with your actual password (should already be in `.env.local`)

### Step 3: Restart Server
```bash
# Kill current process (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## Alternative: Use MongoDB Local (No IP Issues)

If you want to skip MongoDB Atlas setup, you can use MongoDB locally:

### Install MongoDB Locally
1. Download from [mongodb.com/try/download/community](https://mongodb.com/try/download/community)
2. Install (default settings)
3. MongoDB starts automatically

### Update `.env.local`
```env
MONGODB_URI=mongodb://localhost:27017/pharma-platform
```

### Restart Server
```bash
npm run dev
```

---

## Testing Connection

After making these changes, try signing up again. You should see:
- ✅ Account created successfully
- ✅ Verification email sent to Gmail
- ✅ User saved in MongoDB

If still failing, check:
- [ ] Network Access whitelist includes "Allow from Anywhere"
- [ ] Connection string has correct database name (`pharma-platform`)
- [ ] `.env.local` is saved with new values
- [ ] Dev server restarted after changes
