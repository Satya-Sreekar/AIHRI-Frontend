# PowerShell script to deploy frontend to AWS S3
# Make sure you have AWS CLI configured first

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:8000/api"
)

Write-Host "🚀 Deploying AIHRI Frontend to S3" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Step 1: Set API URL
Write-Host "📝 Setting API URL to: $ApiUrl" -ForegroundColor Yellow
$envFile = ".env.local"
"NEXT_PUBLIC_API_URL=$ApiUrl" | Out-File -FilePath $envFile -Encoding UTF8

# Step 2: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 3: Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Upload to S3
Write-Host "☁️ Uploading to S3 bucket: $BucketName" -ForegroundColor Yellow
aws s3 sync ./out s3://$BucketName --delete

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed! Make sure AWS CLI is configured." -ForegroundColor Red
    exit 1
}

# Step 5: Get CloudFront distribution info
Write-Host "🌐 Getting CloudFront distribution info..." -ForegroundColor Yellow
$distributions = aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='$BucketName.s3.amazonaws.com'].{Id:Id,DomainName:DomainName}" --output table

if ($distributions) {
    Write-Host "✅ Upload complete!" -ForegroundColor Green
    Write-Host "🌍 Your frontend should be available at the CloudFront URL above" -ForegroundColor Green
} else {
    Write-Host "⚠️ Upload complete, but no CloudFront distribution found for this bucket" -ForegroundColor Yellow
    Write-Host "💡 You may need to create a CloudFront distribution manually" -ForegroundColor Yellow
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your backend is running with ngrok" -ForegroundColor White
Write-Host "2. Test your CloudFront URL" -ForegroundColor White
Write-Host "3. Check browser console for any CORS errors" -ForegroundColor White



