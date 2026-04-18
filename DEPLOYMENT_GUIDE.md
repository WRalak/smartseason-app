# SmartSeason Deployment Guide

## 🚨 CORS Error Resolution

### Current Issue:
```
Access to XMLHttpRequest at 'http://localhost:4000/api/auth/login' from origin 'https://smartseason-app.vercel.app' has been blocked by CORS policy
```

### Root Cause:
- Frontend (Vercel) trying to access backend (localhost)
- Browsers block cross-origin requests for security

## 🎯 Solutions

### Option 1: Deploy Backend (Recommended)
Deploy backend to production service:

#### Vercel (Easiest):
```bash
# Deploy backend to Vercel
cd backend
npx vercel --prod
```

#### Railway:
```bash
# Deploy backend to Railway
cd backend
railway login
railway deploy
```

#### Heroku:
```bash
# Deploy backend to Heroku
cd backend
heroku create smartseason-backend
git push heroku master
```

### Option 2: Update Frontend API URL
Change frontend to use production backend:

#### Update client.js:
```javascript
// Change from localhost to production URL
const api = axios.create({
  baseURL: 'https://your-backend-url.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### Environment Variables:
```bash
# Set production API URL
VITE_API_URL=https://your-backend-url.com/api
```

### Option 3: Enable CORS in Backend (Development Only)
Update backend CORS settings:

#### server.js:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://smartseason-app.vercel.app'],
  credentials: true
}));
```

## 🚀 Recommended Deployment Strategy

### For Production:
1. **Deploy Backend** to Vercel/Railway/Heroku
2. **Update Frontend** with production API URL
3. **Environment Variables** for different environments
4. **Testing** on production URLs

### For Development:
1. **Keep Backend** on localhost
2. **Enable CORS** for development frontend
3. **Use same origin** or disable CORS in browser

## 📋 Quick Fix (Development)

If you want to test quickly:

1. **Disable CORS** in browser:
   - Chrome: Launch with `--disable-web-security`
   - Firefox: Set `security.cors.enable` to `false` in about:config

2. **Use browser extension** to disable CORS

3. **Run frontend locally**:
   ```bash
   cd client
   npm run dev
   # Access at http://localhost:5173
   ```

## 🎯 Production URLs

Once deployed:
- **Frontend**: https://smartseason-app.vercel.app
- **Backend**: https://your-backend-url.com
- **Full App**: Both services running in production

Choose the best option for your needs!
