# Test session status
$baseUrl = "http://127.0.0.1:8000/api"

Write-Host "`n=== Testing Session Status ===" -ForegroundColor Cyan

try {
    # Test /auth/me endpoint
    Write-Host "`nCalling /auth/me..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -UseBasicParsing -SessionVariable session
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor White
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
    
    # Check cookies
    Write-Host "`nCookies received:" -ForegroundColor Yellow
    $response.Headers['Set-Cookie'] | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
