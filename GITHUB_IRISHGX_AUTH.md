# GitHub Authentication for irishgx Account

## Issue
The push failed because you're currently authenticated as `jmullavey`, but trying to push to `irishgx` account.

## Solutions

### Option 1: Use SSH (Recommended if you have SSH keys set up)

If you have SSH keys configured for the irishgx account:

```bash
cd /Users/jmullavey/Financial
git remote set-url irishgx git@github.com:irishgx/Financial-Tracker.git
git push irishgx main
```

### Option 2: Use Personal Access Token

1. Go to https://github.com/settings/tokens (logged in as irishgx)
2. Generate a new token with `repo` permissions
3. Use the token as password:

```bash
cd /Users/jmullavey/Financial
git push irishgx main
# When prompted:
# Username: irishgx
# Password: <paste your personal access token>
```

### Option 3: Use GitHub CLI

```bash
gh auth login
# Follow prompts to authenticate as irishgx
git push irishgx main
```

### Option 4: Update Git Credentials

```bash
# Update credential helper to prompt for credentials
git config --global credential.helper osxkeychain
# Or for this repo only:
git config credential.helper store
git push irishgx main
# Enter irishgx username and token when prompted
```

## Quick Test

You can test if authentication works by trying to fetch:

```bash
git fetch irishgx
```

If this works, then push will work too.

