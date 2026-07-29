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
Write-Host "Pushed to $RepoUrl" -ForegroundColor Green
