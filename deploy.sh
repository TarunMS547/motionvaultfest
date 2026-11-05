#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "✨ Deploying Diwali Site to Firebase Hosting..."
echo "Account: tarunms098@gmail.com"
echo "Project: DIWALI WISHES"
echo ""

# Ensure tarunms098@gmail.com is authorized
if ! firebase login:list | grep -q "tarunms098@gmail.com"; then
  echo "👉 Opening browser to authorize tarunms098@gmail.com..."
  firebase login:add tarunms098@gmail.com
fi

# Switch active account
firebase login:use tarunms098@gmail.com

# Deploy hosting
echo "🚀 Deploying hosting files..."
firebase deploy --only hosting

