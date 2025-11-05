# JSON Persistence on Vercel

## Overview

The application now supports persistent JSON storage on Vercel using **Vercel KV** (Redis). The storage layer automatically switches between:

- **Local Development**: File system (`./data` directory)
- **Production (Vercel)**: Vercel KV (Redis) for persistent storage

## How It Works

The storage system uses an adapter pattern that:
1. Detects if running on Vercel with KV configured
2. Uses Vercel KV if available (persistent across deployments)
3. Falls back to file system for local development

**No code changes needed** - the JSON structure and API remain exactly the same.

## Setup Instructions

### 1. Create Vercel KV Store

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database**
3. Select **KV** (Redis)
4. Choose a name (e.g., `financial-tracker-kv`)
5. Select a region close to your users
6. Click **Create**

### 2. Environment Variables (Auto-Configured)

Vercel automatically sets these environment variables when you create a KV store:
- `KV_URL` - Connection URL
- `KV_REST_API_URL` - REST API endpoint
- `KV_REST_API_TOKEN` - API token

These are automatically linked to your project - no manual setup needed!

### 3. Verify Setup

After deployment, check your Vercel function logs. You should see:
```
Using Vercel KV for persistent JSON storage
```

If you see:
```
Using file system for JSON storage: /tmp/financial-tracker-data
```

Then KV is not configured, and it's using ephemeral `/tmp` storage.

## Local Development

For local development, the system automatically uses file system storage:
- Data stored in `./data` directory (or `DATA_DIR` env var)
- No Vercel KV needed
- Works exactly as before

## Data Migration

If you have existing data in JSON files:

1. **Export from local** (if you have data):
   ```bash
   # Copy your local data directory
   cp -r backend/data ./data-backup
   ```

2. **After KV setup**, data will be stored in KV automatically
3. **To migrate existing data**, you can:
   - Manually import via the app's import feature
   - Or write a migration script (future enhancement)

## Storage Keys

JSON files are stored in Vercel KV with the prefix `financial-tracker:`:
- `financial-tracker:users.json`
- `financial-tracker:accounts.json`
- `financial-tracker:transactions.json`
- etc.

## Benefits

✅ **Persistent**: Data survives deployments and cold starts  
✅ **Fast**: Redis is extremely fast  
✅ **Scalable**: Handles high request volumes  
✅ **Simple**: Still uses JSON format, no database migration needed  
✅ **Automatic**: Switches between file system and KV based on environment  

## Troubleshooting

### Data Not Persisting

1. Check Vercel logs for "Using Vercel KV" message
2. Verify KV store is created and linked to your project
3. Check environment variables in Vercel dashboard

### Local Development Issues

- Make sure `DATA_DIR` is writable
- Check that `./data` directory exists or can be created
- Verify file permissions

### KV Connection Errors

- Ensure KV store is created in Vercel
- Check that environment variables are set
- Verify KV store is in the same region as your functions

## Cost Considerations

Vercel KV pricing:
- **Free tier**: 256 MB storage, 30,000 commands/day
- **Pro tier**: Starts at $0.20/month per GB

For most applications, the free tier is sufficient.

## Next Steps

1. Create KV store in Vercel dashboard
2. Redeploy your application
3. Verify logs show "Using Vercel KV"
4. Test data persistence by creating a user/transaction and redeploying

