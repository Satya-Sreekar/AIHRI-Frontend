# PowerShell script to deploy frontend to Vercel
param(
    [Parameter(Mandatory=$true)]
    [string]$BackendIP,
    
    [Parameter(Mandatory=$false)]
    [int]$BackendPort = 8000,
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectName = "aihri-frontend"
)

$ApiUrl = "http://$BackendIP`:$BackendPort/api"

Write-Host "🚀 Deploying AIHRI Frontend to Vercel" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "🌍 Backend IP: $BackendIP" -ForegroundColor Yellow
Write-Host "🔌 Backend Port: $BackendPort" -ForegroundColor Yellow
Write-Host "🔗 API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host "📦 Project Name: $ProjectName" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if Vercel CLI is installed
Write-Host "1️⃣ Checking Vercel CLI..." -ForegroundColor Cyan
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually:" -ForegroundColor Red
        Write-Host "   npm install -g vercel" -ForegroundColor Gray
        exit 1
    }
}

# Step 2: Set environment variable
Write-Host "`n2️⃣ Setting environment variable..." -ForegroundColor Cyan
Write-Host "   NEXT_PUBLIC_API_URL=$ApiUrl" -ForegroundColor Gray

# Step 3: Login to Vercel (if not already logged in)
Write-Host "`n3️⃣ Checking Vercel authentication..." -ForegroundColor Cyan
try {
    vercel whoami | Out-Null
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed!" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Deploy to Vercel
Write-Host "`n4️⃣ Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "   This may take a few minutes..." -ForegroundColor Gray

# Set environment variable for this session
$env:NEXT_PUBLIC_API_URL = $ApiUrl

# Deploy
vercel --prod --name $ProjectName --env NEXT_PUBLIC_API_URL=$ApiUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Make sure your backend is running:" -ForegroundColor White
    Write-Host "   cd ../AIHRI-Backend" -ForegroundColor Gray
    Write-Host "   python start_public_backend.py" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Test your Vercel deployment" -ForegroundColor White
    Write-Host "3. Check browser console for any errors" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Your app should be live at the URL shown above!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above and try again." -ForegroundColor Red
}
