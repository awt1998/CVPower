# Auto-sync to GitHub

These scripts push the project to `https://github.com/awt1998/CVPower` automatically.
Because Git credentials must belong to you, there is a **one-time setup**; after that
syncing is hands-off.

## Step 1 — Authenticate once (choose one)

- **GitHub CLI (recommended):** install from https://cli.github.com then run:
  ```powershell
  gh auth login
  ```
- **Or** just run the setup script below and let *Git Credential Manager* (bundled
  with Git for Windows) prompt you to sign in on the first push.

## Step 2 — First push

In PowerShell, from the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File ".\scripts\setup-github.ps1"
```

> If your repository is named differently, edit `$RepoUrl` in `setup-github.ps1`.

## Step 3 — Make it automatic (runs every 5 minutes, no intervention)

Run this **once** in PowerShell to register a scheduled task:

```powershell
$script = "D:\ABDULLAH ALTEWAL\pwCVPower - AI Resume Builderor\scripts\git-autosync.ps1"
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$script`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Minutes 5)
Register-ScheduledTask -TaskName 'CVPower AutoSync' -Action $action -Trigger $trigger `
  -Description 'Auto commit and push CVPower to GitHub'
```

From then on, every change you save is committed and pushed automatically. To stop it:

```powershell
Unregister-ScheduledTask -TaskName 'CVPower AutoSync' -Confirm:$false
```

## Notes

- The scripts commit **all** tracked/untracked files except those in `.gitignore`
  (e.g. `node_modules`, `.next`, `.env`). Never commit secrets.
- Prefer syncing after meaningful changes? Just run `git-autosync.ps1` manually
  instead of scheduling it.
