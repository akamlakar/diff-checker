#!/bin/bash

# Quick Setup Script for Diff Checker
# Prepares the project for first-time deployment

set -e

echo "🔧 Setting up Diff Checker for production..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys:"
    echo "   - Google Analytics 4 Measurement ID"
    echo "   - Google AdSense Publisher ID and Slot IDs"
    echo "   - Sentry DSN"
    echo ""
    echo "   Then update placeholders in:"
    echo "   - index.html (GA4 and AdSense IDs)"
    echo "   - src/monitoring.js (Sentry DSN)"
fi

# Create placeholder icons if they don't exist
if [ ! -f icon-192.png ]; then
    echo "⚠️  PWA icons missing. Please create:"
    echo "   - icon-192.png (192x192px)"
    echo "   - icon-512.png (512x512px)"
    echo "   Use https://realfavicongenerator.net/ to generate them"
fi

# Test build
echo "🔨 Testing build process..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env with your API keys"
echo "2. Create PWA icons (icon-192.png, icon-512.png)"
echo "3. Update placeholder IDs in index.html and src/monitoring.js"
echo "4. Test locally: npm run dev"
echo "5. Deploy: ./scripts/deploy.sh or npm run deploy"
echo ""
echo "📖 Read README.md for complete documentation"
