# 🚀 Quick Start Guide

## Step 1: Clone & Setup

```bash
# Go to your workspace
cd /workspaces/J-R-Cosmetics-backend

# Run the automated setup
npm run setup
```

## Step 2: What the Setup Does

✅ Installs all dependencies  
✅ Checks for `.env` file  
✅ Seeds database with 8 sample products  
✅ Creates test user account  

**Test Account Created:**
- Email: `test@example.com`
- Password: `password123`

## Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
✅ Server running on port 5000
📍 Environment: development
🌐 API Documentation:
   GET  http://localhost:5000/health
   GET  http://localhost:5000/api/products
   POST http://localhost:5000/api/auth/register
```

## Step 4: Test the API

### Option A: Browser (Quick Test)
Open these URLs in your browser:
- http://localhost:5000/health
- http://localhost:5000/api/products

### Option B: Postman (Recommended)

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new request
3. Follow the examples in [API_TESTING.md](API_TESTING.md)

### Option C: cURL Commands

```bash
# Health check
curl http://localhost:5000/health

# Get all products
curl http://localhost:5000/api/products
```

## Step 5: Get JWT Token to Access Protected Routes

```bash
# Login with test account
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the token from response!**

## Step 6: Use Token for Protected Routes

```bash
# Get user profile (replace TOKEN with actual token)
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Available Commands

```bash
npm run dev       # Start with hot reload
npm start         # Start production server
npm run seed      # Reset DB and add sample data
npm run setup     # Full setup (install + seed)
npm run reset     # Reset database
```

## 🗂️ Project Structure

```
├── config/        # Database config
├── models/        # MongoDB schemas
├── controllers/   # Business logic
├── routes/        # API endpoints
├── middleware/    # Auth, validation, errors
├── scripts/       # Seed & setup scripts
├── server.js      # Main app
└── .env           # Your secrets (don't commit!)
```

## 📚 Complete API Documentation

See [API_TESTING.md](API_TESTING.md) for all 20 endpoints with examples

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
- Check your MONGODB_URI in .env
- Make sure your MongoDB cluster accepts connections from your IP
- Go to Atlas > Network Access > Add IP whitelist

**"Port 5000 already in use"**
```bash
# Change port in .env
PORT=5001
```

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## ✨ Next Steps

1. ✅ Install dependencies
2. ✅ Create MongoDB account
3. ✅ Set up .env file
4. ✅ Seed database
5. ✅ Start server
6. ⬜ **Connect your frontend** to the API
7. ⬜ Integrate payment provider (Mpesa)
8. ⬜ Test all endpoints
9. ⬜ Deploy to Render.com

## 📞 Need Help?

Check the detailed [README.md](README.md) for:
- Complete API documentation
- Database schemas
- Example requests
- Deployment instructions
