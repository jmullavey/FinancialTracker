# Production Fix for mullavey.xyz

## Issues Fixed

1. ✅ **API URL Auto-Detection**: Updated `frontend/src/services/api.ts` to automatically use the production URL (`https://mullavey.xyz/api`) when running on HTTPS
2. ✅ **Icon Path Fix**: Updated manifest.json to match vite.config.ts icon paths

## Required Environment Variables in Vercel

You need to set these environment variables in your Vercel project dashboard:

### 1. CORS_ORIGINS (Required)
**Value**: `https://mullavey.xyz`

**How to set:**
```bash
vercel env add CORS_ORIGINS production
# When prompted, enter: https://mullavey.xyz
```

Or via Vercel Dashboard:
1. Go to: https://vercel.com/irishgxs-projects/financial-tracker/settings/environment-variables
2. Click "Add New"
3. Name: `CORS_ORIGINS`
4. Value: `https://mullavey.xyz`
5. Environments: Select "Production"
6. Click "Save"

### 2. JWT_SECRET (Required)
**Generate a secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Set it:**
```bash
vercel env add JWT_SECRET production
# Paste the generated secret when prompted
```

Or via Vercel Dashboard:
1. Generate secret using the command above
2. Go to environment variables page
3. Add `JWT_SECRET` with the generated value
4. Select "Production" environment

### 3. NODE_ENV (Required)
**Value**: `production`

```bash
vercel env add NODE_ENV production
# Enter: production
```

### 4. VITE_API_URL (Optional - Auto-detected now)
The API URL is now auto-detected, but you can explicitly set it:
**Value**: `https://mullavey.xyz`

```bash
vercel env add VITE_API_URL production
# Enter: https://mullavey.xyz
```

## After Setting Environment Variables

1. **Redeploy** your application:
   ```bash
   vercel --prod
   ```

   Or push a new commit to trigger auto-deployment.

2. **Verify** the deployment:
   - Check that registration works at: https://mullavey.xyz/register
   - Check browser console for any remaining errors

## Icon Files (Optional)

If you want to fix the icon warning, create these files in `frontend/public/`:
- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)

You can use any image editor or online tool to create these. The icons should represent your Financial Tracker app.

## Quick Setup Script

Run these commands to set all required environment variables:

```bash
# Generate JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Generated JWT_SECRET: $JWT_SECRET"

# Set environment variables
vercel env add CORS_ORIGINS production
# Enter: https://mullavey.xyz

vercel env add JWT_SECRET production
# Paste the JWT_SECRET from above

vercel env add NODE_ENV production
# Enter: production

# Redeploy
vercel --prod
```

## Verification Checklist

- [ ] CORS_ORIGINS is set to `https://mullavey.xyz`
- [ ] JWT_SECRET is set (32+ character random string)
- [ ] NODE_ENV is set to `production`
- [ ] Application has been redeployed
- [ ] Registration works at https://mullavey.xyz/register
- [ ] No CORS errors in browser console

