# Complete Vercel Deployment Guide

## Overview

This guide walks you through deploying the Financial Tracker application to Vercel with persistent JSON storage using Vercel KV.

## Prerequisites

- GitHub repository connected to Vercel
- Vercel account (free tier works)
- Node.js 18+ installed locally (for testing)

## Step 1: Prepare Your Repository

### 1.1 Verify Build Commands

The project uses npm workspaces. Verify these scripts in `package.json`:

```json
{
  "scripts": {
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build"
  }
}
```

### 1.2 Test Build Locally

Before deploying, test the build:

```bash
# Clean previous builds
rm -rf backend/dist frontend/dist

# Install dependencies
npm install

# Build both frontend and backend
npm run build

# Verify builds succeeded
ls backend/dist/index.js  # Should exist
ls frontend/dist/index.html  # Should exist
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New" → "Project"

2. **Import Repository**
   - Select your GitHub repository
   - Vercel will auto-detect the configuration

3. **Configure Project Settings**
   - **Framework Preset**: None (or Other)
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install --legacy-peer-deps`

4. **Click Deploy**
   - Vercel will start the build process
   - Monitor the build logs for any errors

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

## Step 3: Set Up Persistent Storage (Vercel KV)

### 3.1 Create KV Store

1. **In Vercel Dashboard**
   - Go to your project
   - Click **Storage** tab
   - Click **Create Database**
   - Select **KV** (Redis)
   - Choose a name (e.g., `financial-tracker-kv`)
   - Select a region (choose closest to your users)
   - Click **Create**

### 3.2 Verify KV Connection

Vercel automatically sets these environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

No manual configuration needed!

### 3.3 Verify Storage is Working

After deployment, check function logs:
- Look for: `"Using Vercel KV for persistent JSON storage"`
- If you see: `"Using file system for JSON storage: /tmp/..."` then KV is not configured

## Step 4: Configure Environment Variables

### Required Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

#### 1. JWT_SECRET (Required)
```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- **Name**: `JWT_SECRET`
- **Value**: (paste generated secret)
- **Environments**: Production, Preview, Development

#### 2. CORS_ORIGINS (Required for Production)
- **Name**: `CORS_ORIGINS`
- **Value**: Your Vercel domain(s), comma-separated
  - Example: `https://your-app.vercel.app,https://your-app-git-main.vercel.app`
- **Environments**: Production, Preview

#### 3. NODE_ENV
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environments**: Production

### Optional Variables

#### JWT_EXPIRES_IN
- **Name**: `JWT_EXPIRES_IN`
- **Value**: `7d`
- **Environments**: Production, Preview

#### Email Configuration (if using email features)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Or `SENDGRID_API_KEY`
- Or `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`

## Step 5: Verify Deployment

### 5.1 Check Deployment Status

1. **Vercel Dashboard**
   - Go to your project → Deployments
   - Verify latest deployment shows "Ready" ✅

2. **Test API Health**
   ```bash
   curl https://your-app.vercel.app/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

3. **Test Frontend**
   - Visit your deployment URL
   - Should see the login/register page

### 5.2 Test Data Persistence

1. **Register a New User**
   - Create an account via the registration page
   - Verify registration succeeds

2. **Check Logs**
   ```bash
   vercel logs <deployment-url>
   ```
   - Look for: `"Using Vercel KV for persistent JSON storage"`
   - Verify no errors related to storage

3. **Redeploy and Verify**
   - Make a small change and redeploy
   - Log in again - user should still exist
   - This confirms data persists across deployments

## Step 6: Troubleshooting

### Build Fails

**Issue**: Rollup/platform module error
- **Solution**: The `--legacy-peer-deps` flag should fix this
- If persists, try: `npm install --legacy-peer-deps` locally first

**Issue**: TypeScript errors
- **Solution**: Run `npm run build` locally to identify errors
- Fix errors before deploying

**Issue**: Module not found errors
- **Solution**: Ensure all dependencies are in `package.json`
- Check workspace configuration

### Runtime Errors

**Issue**: "Cannot find module '../backend/dist/index.js'"
- **Solution**: Verify backend build succeeded
- Check `backend/dist/index.js` exists after build

**Issue**: "Using file system for JSON storage: /tmp/..."
- **Solution**: KV store not created or not linked
- Create KV store in Vercel dashboard
- Verify environment variables are set

**Issue**: API returns 500 errors
- **Solution**: Check Vercel function logs
- Verify environment variables are set
- Check JWT_SECRET is configured

### Data Not Persisting

**Issue**: Data lost after redeployment
- **Solution**: Verify KV store is created and linked
- Check logs for "Using Vercel KV" message
- Verify KV environment variables exist

## Step 7: Monitoring and Maintenance

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Specific deployment
vercel logs <deployment-url>
```

### Monitor Performance

- **Vercel Dashboard** → Analytics
- Check function execution times
- Monitor error rates

### Update Deployment

```bash
# Push to main branch (auto-deploys)
git push origin main

# Or manually deploy
vercel --prod
```

## Deployment Checklist

- [ ] Build succeeds locally (`npm run build`)
- [ ] Vercel project created and linked
- [ ] KV store created and linked
- [ ] Environment variables set:
  - [ ] JWT_SECRET
  - [ ] CORS_ORIGINS
  - [ ] NODE_ENV
- [ ] Initial deployment successful
- [ ] Health check endpoint works (`/api/health`)
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] Data persists after redeployment
- [ ] Logs show "Using Vercel KV"

## Next Steps

1. **Set up custom domain** (optional)
   - Vercel Dashboard → Settings → Domains
   - Add your domain

2. **Configure email service** (if needed)
   - Set SMTP or SendGrid credentials
   - Test email verification

3. **Set up monitoring**
   - Configure error tracking (Sentry, etc.)
   - Set up uptime monitoring

4. **Backup strategy**
   - Export data periodically
   - Consider automated backups

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel KV Docs**: https://vercel.com/docs/storage/vercel-kv
- **Project Issues**: Check GitHub issues or Vercel logs

## Quick Reference

```bash
# Deploy
vercel --prod

# View logs
vercel logs

# Check environment variables
vercel env ls

# Add environment variable
vercel env add JWT_SECRET production

# Inspect deployment
vercel inspect <url>
```

