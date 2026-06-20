# Lumiasia Master Verification Script
$ErrorActionPreference = "Continue"

Write-Host "Starting Lumiasia Final Verification..." -ForegroundColor Cyan

# 1. Clean up old reports
if (Test-Path "VERIFICATION_REPORT.md") { Remove-Item "VERIFICATION_REPORT.md" }

$report = @"
# Lumiasia Final Verification Report
Generated: $(Get-Date)

## 📊 Summary
| Check | Status |
|---|---|
| Unit Tests (Vitest) | [Pending] |
| E2E Tests (Playwright) | [Pending] |
| Performance Audits | [Pending] |
| Production Build | [Pending] |

---

"@

# 2. Run Unit Tests
Write-Host "Running Unit Tests..." -ForegroundColor Yellow
$unitResults = npm run test 2>&1
if ($LASTEXITCODE -eq 0) {
    $report = $report.Replace("| Unit Tests (Vitest) | [Pending] |", "| Unit Tests (Vitest) | ✅ PASS |")
} else {
    $report = $report.Replace("| Unit Tests (Vitest) | [Pending] |", "| Unit Tests (Vitest) | ❌ FAIL |")
}

# 3. Run E2E Tests (including performance)
Write-Host "Running E2E and Performance Tests..." -ForegroundColor Yellow
$e2eResults = npx playwright test --project=chromium 2>&1
if ($LASTEXITCODE -eq 0) {
    $report = $report.Replace("| E2E Tests (Playwright) | [Pending] |", "| E2E Tests (Playwright) | ✅ PASS |")
    $report = $report.Replace("| Performance Audits | [Pending] |", "| Performance Audits | ✅ PASS |")
} else {
    $report = $report.Replace("| E2E Tests (Playwright) | [Pending] |", "| E2E Tests (Playwright) | ❌ FAIL |")
    $report = $report.Replace("| Performance Audits | [Pending] |", "| Performance Audits | ⚠️ CHECK LOGS |")
}

# 4. Run Build
Write-Host "Verifying Production Build..." -ForegroundColor Yellow
$buildResults = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    $report = $report.Replace("| Production Build | [Pending] |", "| Production Build | ✅ PASS |")
} else {
    $report = $report.Replace("| Production Build | [Pending] |", "| Production Build | ❌ FAIL |")
}

# 5. Finalize Report
$report += "## Detailed Logs`n`n"
$report += "### Unit Tests`n" + $unitResults + "`n`n"
$report += "### E2E Tests`n" + $e2eResults + "`n`n"
$report += "### Build Status`n" + $buildResults + "`n`n"

$report | Out-File -FilePath "VERIFICATION_REPORT.md" -Encoding utf8

Write-Host "Verification Complete! See VERIFICATION_REPORT.md" -ForegroundColor Green
