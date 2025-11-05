# Vercel Deployment Guide

## ✅ JSON Persistence Solution

**JSON Storage**: The application now uses **Vercel KV** (Redis) for persistent JSON storage on Vercel, while maintaining the same JSON format and API.

- ✅ **Persistent**: Data survives deployments and cold starts
- ✅ **Automatic**: Automatically uses Vercel KV when configured, falls back to file system locally
- ✅ **Same JSON Format**: No database migration needed - still uses JSON files
- ✅ **Zero Code Changes**: Existing code works without modification

### Setup JSON Persistence

1. **Create Vercel KV Store**:
   - Go to Vercel Dashboard → Your Project → Storage
   - Click "Create Database" → Select "KV"
   - Choose a name and region
   - Click "Create"

2. **Environment Variables** (Auto-configured):
   - Vercel automatically sets `KV_URL`, `KV_REST_API_URL`, and `KV_REST_API_TOKEN`
   - No manual configuration needed!

3. **Verify**:
   - After deployment, check logs for "Using Vercel KV for persistent JSON storage"

For detailed setup instructions, see **[VERCEL_JSON_PERSISTENCE.md](./VERCEL_JSON_PERSISTENCE.md)**

### Alternative Solutions (If Needed)

If you prefer other storage options:

### Option 1: Use a Database
- Migrate to PostgreSQL, MongoDB, Supabase, etc.
- Requires code changes to replace JSON storage

### Option 2: Use Vercel Blob Storage
- For file uploads and large binary data
- Already partially implemented in `backend/src/services/s3.ts`

## Current Configuration

The project is configured for Vercel deployment with:

- **Frontend**: Served as static files from `frontend/dist`
- **Backend**: Wrapped as serverless function in `api/index.ts`
- **Routes**: API routes (`/api/*`) proxy to serverless function
- **Build**: Runs `npm run build` which builds both frontend and backend

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   After deployment, go to Vercel dashboard → Project Settings → Environment Variables and add:
   - `JWT_SECRET` - Generate a strong secret
   - `CORS_ORIGINS` - Your Vercel domain (e.g., `https://your-project.vercel.app`)
   - `NODE_ENV` - Set to `production`
   - `VITE_API_URL` - Set to your Vercel API URL (auto-set by Vercel)

5. **Redeploy** after setting environment variables:
   ```bash
   vercel --prod
   ```

## Environment Variables for Vercel

Required:
- `JWT_SECRET` - Strong secret for JWT tokens (32+ characters)
- `CORS_ORIGINS` - Your Vercel domain(s)

Optional:
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `NODE_ENV` - Set to `production`

## Testing Locally with Vercel

```bash
vercel dev
```

This will start a local development server that mimics Vercel's environment.

## Next Steps

1. **For immediate testing**: Deploy as-is, but note that data won't persist
2. **For production**: Choose one of the storage solutions above and migrate the code
3. **Consider**: Using Vercel's database integration or migrating to a full database solution

