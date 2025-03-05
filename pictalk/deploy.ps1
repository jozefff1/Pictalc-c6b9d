# PowerShell deployment script for Pictalk

Write-Host "Starting Pictalk deployment process..." -ForegroundColor Cyan

# Clean up any previous build artifacts
Write-Host "Cleaning up previous build artifacts..." -ForegroundColor Yellow
if (Test-Path -Path ".\dist") {
    Remove-Item -Path ".\dist" -Recurse -Force
    Write-Host "Build directory cleaned." -ForegroundColor Green
}

# Build the web version
Write-Host "Building web version..." -ForegroundColor Yellow
try {
    npm run build:web
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Web build completed successfully." -ForegroundColor Green
    } else {
        Write-Host "Web build failed. Please check the error messages above." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "An error occurred during build: $_" -ForegroundColor Red
    exit 1
}

# Run Firebase deploy
try {
    Write-Host "Checking Firebase CLI installation..." -ForegroundColor Yellow
    $firebaseVersion = firebase --version
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Firebase CLI detected: $firebaseVersion" -ForegroundColor Green
        
        Write-Host "Deploying to Firebase hosting..." -ForegroundColor Yellow
        firebase deploy --only hosting
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nDeployment complete! Your app should be live shortly." -ForegroundColor Green
            Write-Host "Visit https://pictalk-c6b9d.web.app to view your application." -ForegroundColor Cyan
        } else {
            Write-Host "Deployment failed. Please check your Firebase configuration." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Firebase CLI not found. Please install it using: npm install -g firebase-tools" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') 