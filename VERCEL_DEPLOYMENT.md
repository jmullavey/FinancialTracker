# Vercel Deployment Guide

## ⚠️ Important Limitations

**File Storage**: The current JSON file storage implementation uses the local filesystem, which is **read-only** in Vercel's serverless environment (except for `/tmp`). This means:

- ❌ User data stored in JSON files will not persist between deployments
- ❌ Each serverless function invocation starts fresh
- ❌ File uploads cannot be stored permanently

## Solutions for Production

To make this application work on Vercel, you have several options:

### Option 1: Use a Database (Recommended)
- Migrate to a database service (MongoDB Atlas, PostgreSQL, Supabase, etc.)
- Replace JSON file storage with database queries
- Best for production scalability

### Option 2: Use Vercel KV or Vercel Blob
- Use Vercel's storage solutions for persistent data
- Good for small to medium applications
- Integrated with Vercel platform

### Option 3: Use External Storage
- Store data in AWS S3, Google Cloud Storage, etc.
- Already partially implemented in `backend/src/services/s3.ts`
- Good for file uploads and large data

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

