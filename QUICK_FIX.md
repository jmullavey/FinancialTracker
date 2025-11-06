# Quick Fix for Login/Registration Issues

## Immediate Steps

### 1. Restart Backend (Fresh Start)
```bash
# Kill any running backend processes
pkill -f "tsx watch"
pkill -f "node.*backend"

# Rebuild and restart
cd backend
npm run build
npm run dev
```

### 2. Restart Frontend (Clear Cache)
```bash
# Kill any running frontend processes
pkill -f "vite"

# Rebuild frontend
cd frontend
rm -rf dist node_modules/.vite
npm run build
npm run dev
```

### 3. Clear Browser Cache
- **Chrome/Edge**: `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
- Or use **Incognito/Private mode** to test

### 4. Verify Backend is Running
Open: http://localhost:3001/api/health
Should see: `{"status":"ok",...}`

### 5. Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to register/login
4. Look for any red error messages
5. Go to **Network** tab
6. Click on the `/api/auth/register` or `/api/auth/login` request
7. Check the **Response** tab for the actual error

## Common Issues & Fixes

### Issue: "Network Error" or "Failed to fetch"
**Fix**: Backend is not running or wrong port
- Check backend is running: `curl http://localhost:3001/api/health`
- Verify frontend API URL in browser console: `console.log(import.meta.env.VITE_API_URL)`

### Issue: "CORS error"
**Fix**: Add your frontend URL to CORS_ORIGINS
- Check what port frontend is running on (usually 5173 for Vite)
- Backend should allow: `http://localhost:5173`

### Issue: "500 Internal Server Error"
**Fix**: Check backend console logs
- Look for "Registration error:" or "Login error:" messages
- Check for storage errors: "Failed to save"

### Issue: Password validation fails
**Fix**: Password must have:
- At least 8 characters
- One uppercase letter
- One lowercase letter  
- One number
- One special character from: `@$!%*?&#`

Example valid password: `Padres#42`

## Test Registration Directly

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Padres#42","firstName":"Test","lastName":"User"}'
```

If this works, the issue is in the frontend. If it fails, check backend logs.

## Still Not Working?

1. **Share the exact error message** from:
   - Browser Console (F12 → Console tab)
   - Browser Network tab (F12 → Network → Click request → Response tab)
   - Backend terminal logs

2. **Verify versions**:
   ```bash
   node --version  # Should be 18.x or 20.x
   npm --version
   ```

3. **Check if ports are available**:
   ```bash
   lsof -i :3001  # Backend port
   lsof -i :5173  # Frontend port (Vite default)
   ```

