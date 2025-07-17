#!/bin/bash

# AlbumAI Build Script
set -e

echo "🚀 Building AlbumAI for production..."

# Build frontend
echo "📦 Building frontend..."
cd album-journey-ui
npm run build
echo "✅ Frontend build complete"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd ../album-journey-api
npm install --production
echo "✅ Backend dependencies installed"

echo "🎉 Build complete! Ready for deployment."
