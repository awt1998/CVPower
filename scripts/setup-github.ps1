# One-time GitHub setup for CVPower.
# Prerequisite (once): authenticate git to GitHub, e.g. `gh auth login`
# (GitHub CLI) or let Git Credential Manager prompt you on first push.

$ErrorActionPreference = 'Stop'
$RepoUrl = 'https://github.com/awt1998/CVPower.git'

# Move to the project root (parent of this scripts folder).
Set-Location -Path (Join-Path $PSScriptRoot '..')

if (-not (Test-Path '.git')) {
  git init | Out-Null
  git branch -M main
}

$hasOrigin = (git remote) -match '^origin$'
if ($hasOrigin) {
  git remote set-url origin $RepoUrl
} else {
  git remote add origin $RepoUrl
}

git add -A
if (git status --porcelain) {
  git commit -m 'Initial CVPower commit' | Out-Null
}

git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "Push failed." -ForegroundColor Red
  Write-Host "The repository probably does not exist on GitHub yet. Create it first, e.g.:" -ForegroundColor Yellow
  Write-Host "  gh repo create awt1998/CVPower --private --source '.' --remote origin --push" -ForegroundColor Yellow
  Write-Host "or create an empty repo named 'CVPower' at https://github.com/new (no README), then re-run this script." -ForegroundColor Yellow
  exit 1
}
Write-Host "Pushed to $RepoUrl" -ForegroundColor Green
