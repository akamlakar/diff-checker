#!/bin/bash

# Stress Test Script for Rate Limiting
# Tests the rate limiting functionality by making multiple requests

echo "🔥 Starting stress test for rate limiting..."
echo "Target: http://localhost:8000"
echo "Rate limit: 100 requests per minute"
echo ""

URL="http://localhost:8000"
REQUESTS=120
DELAY=0.5

echo "Making $REQUESTS requests with ${DELAY}s delay..."
echo ""

SUCCESS=0
FAILED=0
RATE_LIMITED=0

for i in $(seq 1 $REQUESTS); do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)
    
    if [ "$RESPONSE" = "200" ]; then
        SUCCESS=$((SUCCESS + 1))
        echo -n "✅"
    elif [ "$RESPONSE" = "429" ]; then
        RATE_LIMITED=$((RATE_LIMITED + 1))
        echo -n "🚫"
    else
        FAILED=$((FAILED + 1))
        echo -n "❌"
    fi
    
    if [ $((i % 20)) -eq 0 ]; then
        echo " ($i/$REQUESTS)"
    fi
    
    sleep $DELAY
done

echo ""
echo ""
echo "📊 Results:"
echo "  Success: $SUCCESS"
echo "  Rate Limited: $RATE_LIMITED"
echo "  Failed: $FAILED"
echo ""

if [ $RATE_LIMITED -gt 0 ]; then
    echo "✅ Rate limiting is working!"
else
    echo "⚠️  Rate limiting may not be active (test locally or on Netlify)"
fi
