# Load environment variables from .env.local
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
        Write-Host "Loaded: $key" -ForegroundColor Green
    }
}

# Run drizzle-kit push
Write-Host "`nRunning drizzle-kit push..." -ForegroundColor Cyan
npx drizzle-kit push
