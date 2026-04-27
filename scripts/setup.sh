#!/bin/bash

echo "🚀 Setting up J-R Cosmetics Backend..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create a .env file with the following variables:"
    echo ""
    echo "PORT=5000"
    echo "NODE_ENV=development"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jr-cosmetics"
    echo "JWT_SECRET=your_jwt_secret_key_here"
    echo ""
    echo "Get MongoDB URI from: https://www.mongodb.com/cloud/atlas"
    exit 1
else
    echo "✅ .env file found"
fi

echo ""
echo "🌱 Seeding database with sample data..."
node scripts/seed.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completed successfully!"
    echo ""
    echo "🚀 To start the server, run: npm run dev"
    echo "🧪 To run tests, run: npm test"
    echo ""
else
    echo "❌ Setup failed. Check MongoDB connection in .env"
    exit 1
fi
