#!/bin/bash

# Test script to verify CORS fix for ThinkRED API endpoint

echo "🧪 Testing ThinkRED API CORS Fix"
echo "================================="

API_ENDPOINT="https://script.google.com/macros/s/AKfycbxiPo1PZW85C8Pfj7bEKT6yk3es9uRZUo4JAXyGWnvJgYLTmuKQPv7WTYvFCx1O2aAlUg/exec"

# Test data
TEST_DATA='{
  "formType": "CORS Test",
  "name": "Test User",
  "email": "test@example.com",
  "phone": "+1234567890",
  "company": "Test Company",
  "message": "This is a CORS test message from command line"
}'

echo "📡 Testing API endpoint: $API_ENDPOINT"
echo "📝 Test data: $TEST_DATA"
echo ""

# Test GET request (our fallback method)
echo "🔄 Testing GET request (fallback method)..."
ENCODED_DATA=$(echo "$TEST_DATA" | sed 's/ /%20/g' | sed 's/"/%22/g' | sed 's/{/%7B/g' | sed 's/}/%7D/g' | sed 's/:/%3A/g' | sed 's/,/%2C/g')

curl -X GET \
  -H "Accept: application/json" \
  -H "Origin: https://thinkredtech.github.io" \
  -w "\n📊 Response Code: %{http_code}\n⏱️  Response Time: %{time_total}s\n" \
  "${API_ENDPOINT}?action=submitContactForm&data=${ENCODED_DATA}" \
  2>/dev/null

echo ""
echo "✅ If you see JSON response above with success:true, CORS is working!"
echo "❌ If you see an error, there might still be CORS issues."
echo ""
echo "🌐 You can also test manually at: https://thinkredtech.github.io/contact"
