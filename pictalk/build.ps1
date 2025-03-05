# PowerShell build script for Pictalk

function Write-StepHeader {
    param([string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

# Check if Node.js and npm are installed
Write-StepHeader "Checking Dependencies"
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "Node.js detected: $nodeVersion" -ForegroundColor Green
    Write-Host "npm detected: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js or npm not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-StepHeader "Building Web Version"

# Clean up previous web build
if (Test-Path -Path ".\dist") {
    Remove-Item -Path ".\dist" -Recurse -Force
    Write-Host "Cleaned previous web build" -ForegroundColor Yellow
}

# Build web version
try {
    npm run build:web
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nWeb build completed successfully!" -ForegroundColor Green
        Write-Host "You can now run 'npm run deploy' to deploy to Firebase" -ForegroundColor Cyan
    } else {
        Write-Host "Web build failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error during web build: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') 