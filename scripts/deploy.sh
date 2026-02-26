#!/bin/bash

# Production Deployment Script for Diff Checker
# This script automates the deployment process to Netlify

set -e

echo "🚀 Starting Diff Checker Deployment..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please copy .env.example to .env and configure it."
    echo "   cp .env.example .env"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level=moderate || echo "⚠️  Security audit found issues. Review before deploying."

# Build and minify assets
echo "🔨 Building and minifying assets..."
npm run build

# Check if netlify-cli is installed
if ! command -v netlify >/dev/null 2>&1; then
    echo "📥 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo ""
echo "📊 Post-deployment verification:"
echo "1. Visit your Netlify URL and test all features"
echo "2. Check security headers: https://securityheaders.com"
echo "3. Run Lighthouse audit: npm run test:lighthouse"
echo "4. Monitor Sentry dashboard for errors"
echo "5. Check Google Analytics for traffic"
echo ""
echo "🎉 Your app is live and ready for production traffic!"
