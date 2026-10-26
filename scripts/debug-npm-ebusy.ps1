# #region agent log
$ErrorActionPreference = 'Continue'
$log = 'e:\1portfolio\.cursor\debug-d8ff78.log'
function Write-DebugLog($hypothesisId, $message, $data) {
  $payload = [ordered]@{
    sessionId    = 'd8ff78'
    runId        = 'repro'
    hypothesisId = $hypothesisId
    location     = 'scripts/debug-npm-ebusy.ps1'
    message      = $message
    data         = $data
    timestamp    = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  }
  Add-Content -LiteralPath $log -Value (($payload | ConvertTo-Json -Compress -Depth 8))
}
# #endregion

Set-Location 'E:\1portfolio'
New-Item -ItemType Directory -Force -Path 'e:\1portfolio\.cursor' | Out-Null

# #region agent log
$nodes = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match '^(node|npm)' } |
  ForEach-Object {
    $c = $_.CommandLine; if ($c -and $c.Length -gt 160) { $c = $c.Substring(0, 160) }
    @{ pid = $_.ProcessId; name = $_.Name; cmd = $c }
  })
Write-DebugLog 'A' 'pre-install processes' @{ nodes = $nodes; cursor = [bool](Get-Process Cursor -EA SilentlyContinue) }
Write-DebugLog 'D' 'pre-install system scanners' @{
  defender = [bool](Get-Process MsMpEng -EA SilentlyContinue)
  search   = [bool](Get-Process SearchIndexer -EA SilentlyContinue)
}
$nmCount = if (Test-Path node_modules) { (Get-ChildItem node_modules -Directory -EA SilentlyContinue | Measure-Object).Count } else { 0 }
Write-DebugLog 'E' 'pre-install node_modules state' @{ topLevelDirs = $nmCount }
# #endregion

# Fix path (hyp E+C): do NOT rmdir locked trees — rename aside, install into empty folder
$trash = "E:\1portfolio\node_modules.__trash_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
if (Test-Path -LiteralPath 'E:\1portfolio\node_modules') {
  Write-Host "Renaming node_modules -> $trash (avoids EBUSY rmdir)..."
  try {
    Rename-Item -LiteralPath 'E:\1portfolio\node_modules' -NewName (Split-Path $trash -Leaf) -ErrorAction Stop
    # #region agent log
    Write-DebugLog 'E' 'renamed node_modules aside' @{ trash = $trash; ok = $true }
    # #endregion
  } catch {
    # #region agent log
    Write-DebugLog 'A' 'rename node_modules FAILED' @{ err = $_.Exception.Message; ok = $false }
    # #endregion
    Write-Host "Rename failed: $($_.Exception.Message)"
    Write-Host 'Close Cursor and retry, or reboot then rename.'
    exit 2
  }
}

Write-Host 'Running npm install into clean tree (logging to debug-d8ff78.log)...'
$sw = [Diagnostics.Stopwatch]::StartNew()
npm install --no-fund --no-audit 2>&1 | Tee-Object -Variable npmOut
$code = $LASTEXITCODE
$sw.Stop()

# #region agent log
$errLines = @($npmOut | Where-Object { $_ -match 'EBUSY|EPERM|error|locked|Access is denied' } | Select-Object -First 25 | ForEach-Object { "$_" })
$busyPath = $null
foreach ($line in $errLines) {
  if ($line -match "rmdir '([^']+)'") { $busyPath = $Matches[1]; break }
  if ($line -match 'path (E:\\[^\s]+)') { $busyPath = $Matches[1]; break }
}
Write-DebugLog 'C' 'npm install finished' @{
  exitCode   = $code
  elapsedMs  = $sw.ElapsedMilliseconds
  errorLines = $errLines
  busyPath   = $busyPath
}
if ($busyPath) {
  Write-DebugLog 'B' 'busy path after fail' @{
    exists       = (Test-Path -LiteralPath $busyPath)
    parentExists = (Test-Path -LiteralPath (Split-Path $busyPath -Parent))
    isSymlinkHint = ($busyPath -match 'symlink|symlinked|\.resolve-')
  }
}
$nextOk = Test-Path 'node_modules\next\package.json'
$siOk = Test-Path 'node_modules\@vercel\speed-insights\package.json'
Write-DebugLog 'E' 'post-install verify' @{ nextOk = $nextOk; speedInsightsOk = $siOk; exitCode = $code }
# #endregion

Write-Host "EXIT:$code next:$nextOk speed-insights:$siOk"
exit $code
