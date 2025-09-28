# CloudFront Deployment Script for AIHRI Frontend (PowerShell)
# This script builds and prepares the frontend for CloudFront deployment

Write-Host "🚀 Building AIHRI Frontend for CloudFront deployment..." -ForegroundColor Green

# Build the application
Write-Host "📦 Building Next.js application..." -ForegroundColor Yellow
npm run build:cloudfront

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "📁 Static files generated in ./out directory" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Next steps for CloudFront deployment:" -ForegroundColor Magenta
    Write-Host "1. Upload contents of ./out directory to your S3 bucket"
    Write-Host "2. Configure CloudFront distribution to point to S3 bucket"
    Write-Host "3. Set up CORS headers in CloudFront"
    Write-Host "4. Update your backend CORS settings to allow CloudFront domain"
    Write-Host ""
    Write-Host "📋 Files ready for upload:" -ForegroundColor Cyan
    Get-ChildItem ./out/ | Format-Table Name, Length, LastWriteTime
    Write-Host ""
    Write-Host "💡 To upload to S3:" -ForegroundColor Yellow
    Write-Host "aws s3 sync ./out s3://your-bucket-name --delete"
} else {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
