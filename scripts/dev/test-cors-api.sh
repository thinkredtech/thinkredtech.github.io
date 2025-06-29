#!/bin/bash

# Test script to verify CORS fix for ThinkRED API endpoint

echo "🧪 Testing ThinkRED API CORS Fix"
echo "================================="

# Get API endpoint from environment or use placeholder
API_ENDPOINT="${GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL:-https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec}"

if [[ "$API_ENDPOINT" == *"YOUR_DEPLOYMENT_ID_HERE"* ]]; then
    echo "❌ ERROR: Please set GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL environment variable"
    echo "   Example: export GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
    exit 1
fi

echo "📡 Testing API endpoint: $API_ENDPOINT"
echo ""

# Test 1: OPTIONS preflight request (the one that was failing)
echo "🔄 Test 1: Testing OPTIONS preflight request..."
curl -X OPTIONS \
  -H "Origin: https://thinkredtech.github.io" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -w "\n📊 Response Code: %{http_code}\n⏱️  Response Time: %{time_total}s\n" \
  -v \
  "$API_ENDPOINT" \
  2>&1

echo ""
echo "✅ If you see 200 OK with Access-Control headers, preflight is working!"
echo ""

# Test 2: POST request for job application
echo "🔄 Test 2: Testing POST request for job application..."

TEST_JOB_DATA='{
  "action": "submitJobApplication",
  "data": {
    "jobId": "ui-ux-designer",
    "applicationId": "test-'$(date +%s)'",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "resumeBase64": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovTGVuZ3RoIDYgMCBSCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp4nDOxMrJQUEjNyclXyMlPS1WwUsjMLcgvysxLSQUqSC0pzk5NycnMSwex0nKLShNTFZJSyxLzSlKLUhOLUpMzijKLMstSSzKSixKLslEGpOaVpColpubmJeZAlaeklgMdlplXUpSZrWCrEJxalFiYnZpcUpeSX5yZrGATa6tgq1BUpFCZnpiXk1qskI+um5yRWKJglF+cn5ebr5CUCnJFcU4qipWqgKZgU2pbGQBcxDiKCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iago5NAplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDkgMCBSCj4+Cj4+Ci9NZWRpYUJveCBbMC4wMDAwMDAgMC4wMDAwMDAgNjEyLjAwMDAwMCA3OTIuMDAwMDAwXQovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs0IDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9CYXNlRm9udCAvSGVsdmV0aWNhCi9TdWJ0eXBlIC9UeXBlMQo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkCi9TdWJ0eXBlIC9UeXBlMQo+PgplbmRvYmoKeHJlZgo="
  }
}'

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: https://thinkredtech.github.io" \
  -d "$TEST_JOB_DATA" \
  -w "\n📊 Response Code: %{http_code}\n⏱️  Response Time: %{time_total}s\n" \
  "$API_ENDPOINT" \
  2>/dev/null

echo ""
echo "✅ If you see JSON response above with success:true, the job application POST is working!"
echo "❌ If you see an error, there might still be issues with the backend."
echo ""
echo "🌐 You can also test manually at: https://thinkredtech.github.io/apply/ui-ux-designer"
