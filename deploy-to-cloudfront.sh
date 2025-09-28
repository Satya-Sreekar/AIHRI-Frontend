#!/bin/bash
# CloudFront Deployment Script for AIHRI Frontend
# This script builds and prepares the frontend for CloudFront deployment

echo "🚀 Building AIHRI Frontend for CloudFront deployment..."

# Build the application
echo "📦 Building Next.js application..."
npm run build:cloudfront

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Static files generated in ./out directory"
    echo ""
    echo "🌐 Next steps for CloudFront deployment:"
    echo "1. Upload contents of ./out directory to your S3 bucket"
    echo "2. Configure CloudFront distribution to point to S3 bucket"
    echo "3. Set up CORS headers in CloudFront"
    echo "4. Update your backend CORS settings to allow CloudFront domain"
    echo ""
    echo "📋 Files ready for upload:"
    ls -la ./out/
    echo ""
    echo "💡 To upload to S3:"
    echo "aws s3 sync ./out s3://your-bucket-name --delete"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
