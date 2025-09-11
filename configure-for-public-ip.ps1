# PowerShell script to configure frontend for public IP backend
param(
    [Parameter(Mandatory=$true)]
    [string]$PublicIP,
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 8000
)

$ApiUrl = "http://$PublicIP`:$Port/api"

Write-Host "🔧 Configuring Frontend for Public IP Backend" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

Write-Host "🌍 Public IP: $PublicIP" -ForegroundColor Yellow
Write-Host "🔌 Port: $Port" -ForegroundColor Yellow
Write-Host "🔗 API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host ""

# Create .env.local file
Write-Host "📝 Creating .env.local file..." -ForegroundColor Cyan
$envContent = @"
NEXT_PUBLIC_API_URL=$ApiUrl
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ .env.local created with API URL: $ApiUrl" -ForegroundColor Green
Write-Host ""

# Show next steps
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your backend is running:" -ForegroundColor White
Write-Host "   cd ../AIHRI-Backend" -ForegroundColor Gray
Write-Host "   python start_public_backend.py" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the backend connection:" -ForegroundColor White
Write-Host "   curl http://$PublicIP`:$Port/api/" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Build and deploy your frontend:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Gray
Write-Host "   # Then deploy to CloudFront" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Test your CloudFront deployment" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Configuration complete!" -ForegroundColor Green
