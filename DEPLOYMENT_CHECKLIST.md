# Vercel Deployment Checklist

Quick checklist for deploying to Vercel.

## Pre-Deployment

- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (if any)
- [ ] Code committed and pushed to GitHub
- [ ] Repository is connected to Vercel

## Vercel Configuration

- [ ] Project created in Vercel dashboard
- [ ] Build settings configured:
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `frontend/dist`
  - [ ] Install Command: `npm install --legacy-peer-deps`
- [ ] Root directory: `/` (root)

## Storage Setup

- [ ] Vercel KV store created
- [ ] KV store linked to project
- [ ] Verify KV environment variables are auto-set:
  - [ ] `KV_URL` (or `KV_REST_API_URL`)
  - [ ] `KV_REST_API_TOKEN`

## Environment Variables

- [ ] `JWT_SECRET` - Generated and set (32+ characters)
- [ ] `CORS_ORIGINS` - Set to your Vercel domains
- [ ] `NODE_ENV` - Set to `production`
- [ ] `JWT_EXPIRES_IN` - Optional, default `7d`
- [ ] Email config (if using): SMTP or SendGrid variables

## Deployment

- [ ] Initial deployment triggered
- [ ] Build completed successfully
- [ ] No errors in build logs

## Post-Deployment Verification

- [ ] Health check works: `GET /api/health`
- [ ] Frontend loads at root URL
- [ ] API endpoints accessible
- [ ] User registration works
- [ ] User login works
- [ ] Logs show: "Using Vercel KV for persistent JSON storage"
- [ ] Data persists after redeployment

## Testing Data Persistence

1. [ ] Register a new user
2. [ ] Make a small change and redeploy
3. [ ] Verify user still exists after redeployment
4. [ ] Login with same credentials

## Monitoring

- [ ] Function logs are accessible
- [ ] No errors in production logs
- [ ] Performance is acceptable
- [ ] Error tracking set up (optional)

## Troubleshooting

If deployment fails:

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check Vercel function logs: `vercel logs`
5. Verify KV store is created and linked

## Quick Commands

```bash
# Deploy
vercel --prod

# View logs
vercel logs

# Check environment variables
vercel env ls

# Inspect deployment
vercel inspect <deployment-url>
```

