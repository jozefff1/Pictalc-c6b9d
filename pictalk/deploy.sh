#!/bin/bash

# Display a message
echo "Starting Pictalk deployment process..."

# Clean up any previous build artifacts
echo "Cleaning up previous build artifacts..."
rm -rf public/build 2>/dev/null

# Run Firebase deploy
echo "Deploying to Firebase hosting..."
firebase deploy --only hosting

echo "Deployment complete! Your app should be live shortly."
echo "Visit https://pictalk-c6b9d.web.app to view your application." 