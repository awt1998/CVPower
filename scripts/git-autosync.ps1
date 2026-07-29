# Commit and push any changes. Safe to run repeatedly; does nothing if clean.
# Intended to be run on a schedule (see scripts/README.md) for hands-off syncing.

$ErrorActionPreference = 'Stop'
Set-Location -Path (Join-Path $PSScriptRoot '..')

git add -A

$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
  exit 0
}

$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
git commit -m "chore: auto-sync $stamp" | Out-Null
git push origin main
