# Vercel Environment Variables Setup

## Required Environment Variables

You need to set these in the Vercel dashboard or via CLI:

### 1. JWT_SECRET (Required)
- **Generate a strong secret:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Set via CLI:**
  ```bash
  vercel env add JWT_SECRET production
  vercel env add JWT_SECRET preview
  vercel env add JWT_SECRET development
  ```

### 2. CORS_ORIGINS (Required for Production)
- **Get your Vercel deployment URL first** (will be something like `https://financial-tracker.vercel.app`)
- **Set via CLI:**
  ```bash
  vercel env add CORS_ORIGINS production
  # Enter: https://financial-tracker.vercel.app,https://financial-tracker-<your-team>.vercel.app
  ```

### 3. NODE_ENV
```bash
vercel env add NODE_ENV production
# Enter: production
```

### 4. VITE_API_URL (Optional - Auto-set by Vercel)
- Vercel automatically sets this, but you can override if needed
- Should be: `https://your-project.vercel.app/api`

### 5. JWT_EXPIRES_IN (Optional)
```bash
vercel env add JWT_EXPIRES_IN production
# Enter: 7d
```

## Setting via Vercel Dashboard

1. Go to your project: https://vercel.com/irishgxs-projects/financial-tracker
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `JWT_SECRET`
   - **Value**: (paste your generated secret)
   - **Environments**: Select Production, Preview, Development
4. Repeat for other variables

## After Setting Variables

Redeploy by either:
- Push a new commit to GitHub (Vercel auto-deploys)
- Or trigger manually: `vercel --prod`

## Important Notes

⚠️ **File Storage Limitation**: The current JSON file storage won't work on Vercel's serverless environment. Data won't persist between deployments. See `VERCEL_DEPLOYMENT.md` for solutions.

✅ **Security**: Make sure JWT_SECRET is at least 32 characters and never commit it to git.

