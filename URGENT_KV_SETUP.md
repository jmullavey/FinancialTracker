# URGENT: Set Up Vercel KV for Data Persistence

## The Problem

Your application is currently using `/tmp` storage in Vercel's serverless environment, which is **ephemeral**. This means:
- ✅ Registration works (data is saved)
- ❌ Login fails (data is lost between requests)

Each serverless function invocation gets a fresh `/tmp` directory, so user data doesn't persist.

## The Solution: Set Up Vercel KV

Vercel KV (Redis) provides persistent storage that survives between deployments and function invocations.

## Step-by-Step Setup

### 1. Go to Vercel Dashboard

1. Visit: https://vercel.com/irishgxs-projects/financial-tracker
2. Click on the **Storage** tab (in the top navigation)
3. If you don't see Storage, click **Settings** → **Storage**

### 2. Create KV Store

1. Click **Create Database** or **Add Storage**
2. Select **KV** (Redis)
3. Choose a name: `financial-tracker-kv` (or any name you prefer)
4. Select a region: Choose the closest to your users (e.g., `us-east-1`)
5. Click **Create**

### 3. Link to Project

Vercel will automatically:
- Link the KV store to your project
- Set environment variables (`KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`)
- Make them available to all your deployments

### 4. Redeploy

After creating the KV store, you need to redeploy:

**Option A: Via Dashboard**
- Go to **Deployments** tab
- Click the **⋯** (three dots) on the latest deployment
- Click **Redeploy**

**Option B: Via CLI**
```bash
vercel --prod
```

### 5. Verify It's Working

After redeployment, check the logs:

1. Go to **Deployments** → Click on the latest deployment
2. Click **Functions** → Click on any function
3. Look for this message in the logs:
   ```
   Using Vercel KV for persistent JSON storage
   ```

If you see:
```
Using file system for JSON storage: /tmp/financial-tracker-data
```

Then KV is not configured yet - double-check the setup.

## After Setup

Once KV is set up:
1. ✅ Data will persist between requests
2. ✅ Users can register AND login
3. ✅ Data survives deployments
4. ✅ Data survives cold starts

## Test It

1. Register a new user
2. Try to login immediately
3. It should work! 🎉

## Free Tier Limits

Vercel KV free tier includes:
- 256 MB storage
- 30,000 commands/day

This is more than enough for most applications.

## Need Help?

If you encounter issues:
1. Check that the KV store shows as "Connected" in the Storage tab
2. Verify environment variables are set (Settings → Environment Variables)
3. Check deployment logs for errors
4. Make sure you redeployed after creating the KV store

