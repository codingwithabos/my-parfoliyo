param([string]$Url = "http://localhost:3001")
for ($i = 0; $i -lt 60; $i++) {
  try {
    Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 1 | Out-Null
    Start-Process $Url
    exit 0
  } catch {
    Start-Sleep -Milliseconds 500
  }
}
exit 1
