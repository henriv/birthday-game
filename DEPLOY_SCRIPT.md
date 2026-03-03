# 🚀 Automated Deployment Guide

Your deployment scripts are ready! Choose one based on your operating system.

---

## Quick Start

### On Mac/Linux

```bash
# 1. Navigate to your birthday-game folder
cd birthday-game

# 2. Make the script executable (first time only)
chmod +x deploy.sh

# 3. Run it
./deploy.sh
```

### On Windows

```bash
# 1. Navigate to your birthday-game folder
cd birthday-game

# 2. Run it
deploy.bat
```

That's it! The script does everything else.

---

## What the Script Does

When you run it, the script will:

✅ **Configure Git** - Sets up git user  
✅ **Stage Files** - Prepares all code for commit  
✅ **Commit** - Creates initial commit message  
✅ **Set GitHub Remote** - Connects to your GitHub repo  
✅ **Rename Branch** - Changes to "main" branch  
✅ **Push Code** - Uploads everything to GitHub  

Takes about 1-2 minutes.

---

## What Happens After

### You'll See

```
🎉 Birthday Grammar Game - Automated Deployment
==================================================

Step 1: Configuring Git...
✓ Git configured

Step 2: Staging and committing files...
✓ Files committed

Step 3: Setting up GitHub remote...
✓ GitHub remote configured

Step 4: Renaming branch to main...
✓ Branch renamed to main

Step 5: Pushing to GitHub...
(This may take a minute...)
✓ Code pushed to GitHub!

==================================================
✅ GitHub deployment complete!
==================================================
```

### Then You Need to Deploy to Render (Manual)

The script gives you instructions for the final step:

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (lry)
4. Configure with these settings:
   - **Name:** birthday-grammar-game
   - **Runtime:** Node
   - **Build Command:** npm install && npm run build
   - **Start Command:** npm run start
5. Click "Create Web Service"

Render will deploy your app in 2-3 minutes!

---

## If Something Goes Wrong

### Script Won't Run on Mac/Linux

```bash
# Make sure it's executable
chmod +x deploy.sh

# Then try again
./deploy.sh
```

### "Git not found" Error

You need to install Git:
- **Mac:** `brew install git`
- **Windows:** Download from https://git-scm.com/download/win
- **Linux:** `sudo apt install git`

### "Package.json not found" Error

Make sure you're in the `birthday-game` folder:

```bash
ls  # or "dir" on Windows
# Should see: package.json, .env.local, README.md, etc.
```

### Network Error / Push Fails

Possible causes:
1. **No internet connection** - Check your WiFi
2. **Token invalid** - Regenerate at https://github.com/settings/tokens
3. **GitHub down** - Wait and try again

---

## After Deployment Completes

### Security: Revoke Tokens ⚠️

These tokens give full access to your GitHub and Render accounts. Revoke them after deployment:

**GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Find the token you created
3. Click "Delete"

**Render Token:**
1. Go to https://dashboard.render.com/account/api-tokens
2. Find the token you created
3. Click "Delete"

You can create new ones anytime if you need them again.

---

## Common Questions

### Q: Will the script delete anything?
**A:** No, it only adds files. It's completely safe.

### Q: Can I run it multiple times?
**A:** Yes, it's idempotent (safe to run again).

### Q: Where does my code go?
**A:** To your GitHub repo at https://github.com/henriv/lry

### Q: Do I need the Anthropic key?
**A:** No, we removed that requirement!

### Q: How long does deployment take?
**A:** GitHub push: 1-2 minutes  
Render deployment: 2-3 minutes  
Total: ~5 minutes

### Q: Will my game be publicly accessible?
**A:** Yes! On a URL like:  
`https://birthday-grammar-game-xxxx.onrender.com`

---

## Step-by-Step Walkthrough

### 1. Download Your Code

You got a `birthday-game` folder. Put it somewhere safe on your computer.

### 2. Open Terminal/Command Prompt

**Mac/Linux:**
- Press Cmd+Space, type "Terminal", press Enter

**Windows:**
- Press Win+R, type "cmd", press Enter

### 3. Navigate to Folder

```bash
cd /path/to/birthday-game
# or on Windows: cd C:\path\to\birthday-game
```

### 4. Run the Script

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```

### 5. Watch It Happen

The script will output status messages as it works.

### 6. Follow Final Instructions

Script will tell you exactly what to do next in Render dashboard.

---

## You're Ready! 🚀

Everything is set up. Just:

1. Run the appropriate script for your OS
2. Follow the Render setup instructions
3. Share your game URL with friends!

---

## Need Help?

If something doesn't work:

1. Check the error message carefully
2. Make sure you have internet connection
3. Verify tokens are valid
4. Try again

The script is designed to be fault-tolerant and informative!

---

**Your birthday game is about to go live! 🎉**
