# Troubleshooting Registration 500 Error

## Quick Fixes

### 1. Rebuild Frontend
The frontend might be using a cached build. Rebuild it:
```bash
cd frontend
npm run build
```

### 2. Restart Backend
Make sure the backend is running with the latest code:
```bash
cd backend
npm run build
npm run dev
```

### 3. Clear Browser Cache
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear browser cache completely

### 4. Check Backend Logs
When you try to register, check the backend console for error messages. Look for:
- Storage initialization errors
- Password validation errors
- Database save errors

### 5. Test Password Regex
The password `Padres#42` should work. It has:
- ✅ Uppercase: `P`
- ✅ Lowercase: `a`, `d`, `r`, `e`, `s`
- ✅ Number: `4`, `2`
- ✅ Special character: `#`

## Debugging Steps

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Network tab
   - Try registering
   - Click on the `/api/auth/register` request
   - Check the Response tab for the actual error message

2. **Check Backend Console**
   - Look for error messages starting with "Registration error:"
   - Check for "Failed to save" messages
   - Verify storage adapter is initialized: "Using file system for JSON storage"

3. **Test API Directly**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Padres#42","firstName":"Test","lastName":"User"}'
   ```

4. **Verify Storage Works**
   ```bash
   cd backend
   node -e "const {storageAdapter} = require('./dist/services/storage/index.js'); storageAdapter.write('test.json', '[]').then(() => console.log('OK')).catch(e => console.error('Error:', e.message))"
   ```

## Common Issues

### Issue: "Failed to save data"
- **Cause**: Storage adapter can't write to data directory
- **Fix**: Check `backend/data` directory permissions
- **Fix**: Ensure `backend/data` directory exists

### Issue: "Registration error: ..."
- **Cause**: Check the full error message in backend logs
- **Fix**: Look for specific error details after "Registration error:"

### Issue: Frontend validation fails
- **Cause**: Old cached build
- **Fix**: Rebuild frontend: `cd frontend && npm run build`
- **Fix**: Clear browser cache

### Issue: CORS errors
- **Cause**: Frontend and backend on different ports
- **Fix**: Ensure backend is running on port 3001
- **Fix**: Check `VITE_API_URL` in frontend `.env` file

## Still Not Working?

1. Share the **exact error message** from:
   - Browser console (Network tab → Response)
   - Backend console logs
   
2. Verify backend is running:
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"ok",...}`

3. Check if password validation passes:
   - Frontend validation (should show error before submitting)
   - Backend validation (check logs)

