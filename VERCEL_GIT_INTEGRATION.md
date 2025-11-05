# Vercel & GitHub Integration Guide

## How Vercel Auto-Deployment Works

### Overview

When you connect a GitHub repository to Vercel, Vercel automatically:
1. **Detects pushes** to your connected branch (usually `main` or `master`)
2. **Triggers a build** automatically
3. **Deploys** your changes to production or preview environments

### Connection Types

Vercel can be connected to GitHub in two ways:

#### 1. **Via Vercel Dashboard (Recommended)**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Select your GitHub repository
- Vercel automatically sets up webhooks
- Every push to your connected branch triggers a deployment

#### 2. **Via Vercel CLI**
- Uses `vercel link` to connect a local project
- Still requires GitHub repository connection in dashboard for auto-deployments

## Automatic Deployment Flow

```
You push to GitHub → GitHub webhook → Vercel detects change → Builds project → Deploys
```

### What Triggers Deployments

✅ **Automatic Triggers:**
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull Request → Preview deployment
- Merge to `main` → Production deployment

❌ **Manual Triggers:**
- `vercel --prod` command
- Manual deployment from Vercel dashboard

## Deployment Environments

### Production
- **Branch**: `main` (or configured branch)
- **URL**: Your main domain (e.g., `your-project.vercel.app`)
- **Triggered by**: Pushes to `main` branch

### Preview
- **Branch**: Any other branch or PR
- **URL**: Unique preview URL (e.g., `your-project-git-feature-branch.vercel.app`)
- **Triggered by**: Pushes to non-main branches or PR creation

## Current Setup

### Your Repositories

1. **jmullavey/FinancialTracker** (origin)
   - URL: `https://github.com/jmullavey/FinancialTracker.git`
   - This is your main repository

2. **irishgx/Financial-Tracker** (irishgx)
   - URL: `https://github.com/irishgx/Financial-Tracker.git`
   - This is your backup repository

### Vercel Configuration

Your Vercel project is connected to: **irishgx/Financial-Tracker**

This means:
- ✅ Pushes to `irishgx/Financial-Tracker` → **Will trigger Vercel deployments**
- ❌ Pushes to `jmullavey/FinancialTracker` → **Will NOT trigger Vercel deployments** (unless both are connected)

## How to Ensure Auto-Deployment

### Option 1: Connect Both Repositories (Recommended)

If you want deployments from both repositories:

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Under "Git Repository", you can typically only connect one repo
   - However, you can push to the connected repo and Vercel will deploy

2. **Best Practice:**
   - Push to both repositories:
   ```bash
   git push origin main      # Push to jmullavey
   git push irishgx main    # Push to irishgx (connected to Vercel)
   ```

### Option 2: Push to Connected Repository Only

If Vercel is connected to `irishgx/Financial-Tracker`:

```bash
# Always push to the Vercel-connected repo
git push irishgx main
```

### Option 3: Change Vercel Connection

If you want Vercel connected to `jmullavey/FinancialTracker`:

1. Go to Vercel Dashboard
2. Project Settings → Git Repository
3. Disconnect current repository
4. Connect to `jmullavey/FinancialTracker`

## Verification

### Check Current Connection

```bash
# Check Vercel project info
vercel inspect

# Or check Vercel dashboard:
# https://vercel.com/irishgxs-projects/financial-tracker
```

### Test Auto-Deployment

1. Make a small change (e.g., update a comment)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push irishgx main
   ```
3. Check Vercel dashboard - you should see a new deployment starting automatically

## Manual Deployment

If auto-deployment isn't working, you can always deploy manually:

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Troubleshooting

### Auto-Deployments Not Working?

1. **Check Repository Connection:**
   - Go to Vercel Dashboard → Project Settings → Git Repository
   - Verify the correct repository is connected

2. **Check Branch:**
   - Ensure you're pushing to the branch Vercel is watching (usually `main`)

3. **Check Webhooks:**
   - In GitHub: Settings → Webhooks
   - Should see Vercel webhook configured

4. **Check Build Logs:**
   - Vercel Dashboard → Deployments
   - Check if builds are failing

5. **Verify Environment Variables:**
   - Ensure all required env vars are set in Vercel
   - Check both Production and Preview environments

### Common Issues

**Issue**: Changes pushed but no deployment
- **Solution**: Check if correct branch is connected in Vercel

**Issue**: Build fails on Vercel
- **Solution**: Check build logs, ensure all dependencies are in package.json

**Issue**: Environment variables missing
- **Solution**: Add them in Vercel Dashboard → Settings → Environment Variables

## Best Practices

1. **Always push to both repositories** for redundancy:
   ```bash
   git push origin main
   git push irishgx main
   ```

2. **Use feature branches** for development:
   - Create branch: `git checkout -b feature-name`
   - Push: `git push origin feature-name`
   - Vercel will create a preview deployment automatically

3. **Monitor deployments** in Vercel dashboard

4. **Set up notifications** for deployment status

5. **Keep environment variables in sync** between production and preview

## Summary

✅ **Yes, backups to GitHub automatically trigger Vercel deployments IF:**
- The GitHub repository is connected to your Vercel project
- You push to the connected branch (usually `main`)
- The branch matches what Vercel is configured to watch

**Current Status:**
- Your Vercel project is connected to `irishgx/Financial-Tracker`
- Pushing to `irishgx main` will trigger auto-deployments
- Pushing to `jmullavey/FinancialTracker` will NOT trigger deployments (unless you also push to irishgx)

**Recommendation:**
- Always push to both repositories to keep them in sync
- Vercel will auto-deploy from the `irishgx` repository

