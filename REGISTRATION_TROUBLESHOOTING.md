# Registration Troubleshooting Guide

## Common Registration Issues Fixed

### 1. Email Service Failures
**Problem**: If email service failed, registration would fail completely.

**Fix**: Email sending is now non-blocking - registration succeeds even if email fails to send.

### 2. Vercel Serverless Environment
**Problem**: Vercel's serverless functions have read-only filesystem except `/tmp`.

**Fix**: Data directory now uses `/tmp` in Vercel environment:
- Production (Vercel): `/tmp/financial-tracker-data`
- Local/Development: `./data`

**⚠️ Important**: Data in `/tmp` is **ephemeral** - it will be lost between deployments. This is a limitation of serverless functions.

### 3. Better Error Messages
**Fix**: More specific error messages now provided to help diagnose issues.

## Testing Registration

### Local Testing
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Try registering a new account
4. Check console logs for errors

### Production (Vercel) Testing
1. Check Vercel function logs for errors
2. Verify environment variables are set
3. Check if `/tmp` directory is accessible

## Common Error Messages

### "Registration failed"
- Check backend logs for specific error
- Verify database/data directory is writable
- Check if user already exists

### "User already exists"
- Email is already registered
- Try logging in instead

### "Password must contain..."
- Password doesn't meet requirements:
  - At least 8 characters
  - One uppercase letter
  - One lowercase letter
  - One number
  - One special character (@$!%*?&)

## Vercel Serverless Limitations

### Data Persistence
⚠️ **Data stored in `/tmp` will NOT persist** between:
- Deployments
- Function cold starts
- Different serverless instances

### Solutions for Production

1. **Use a Database** (Recommended):
   - PostgreSQL (Vercel Postgres)
   - MongoDB (MongoDB Atlas)
   - Supabase
   - PlanetScale

2. **Use Vercel KV** (Redis):
   - For key-value storage
   - Persistent across deployments

3. **Use Vercel Blob Storage**:
   - For file storage
   - Not suitable for JSON data structures

## Next Steps for Production

To make this production-ready, you should:

1. **Set up a database**:
   ```bash
   # Example: Vercel Postgres
   vercel postgres create
   ```

2. **Update jsonStorage.ts** to use database instead of files

3. **Migrate existing data** (if any)

## Current Status

✅ Registration should now work even if:
- Email service is not configured
- Email sending fails
- On Vercel serverless environment

⚠️ Data will not persist on Vercel (by design of serverless functions)

## Debugging

If registration still fails:

1. **Check backend logs**:
   ```bash
   # Local
   cd backend && npm run dev
   
   # Vercel
   vercel logs
   ```

2. **Check browser console** for frontend errors

3. **Check network tab** in browser DevTools:
   - Look at the `/api/auth/register` request
   - Check response status and error message

4. **Verify environment variables**:
   - `JWT_SECRET` is set
   - `DATA_DIR` (optional, defaults to `./data`)

## Quick Fixes

### If registration fails on Vercel:
1. Ensure environment variables are set
2. Check Vercel function logs
3. Verify `/tmp` directory is writable (should be automatic)

### If email verification doesn't work:
1. Configure email service (SMTP/SendGrid/Mailgun)
2. Or use development mode (emails logged to console)
3. Registration still succeeds even if email fails

