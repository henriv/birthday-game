# 📋 Complete Deployment Guide

Step-by-step instructions to get your Birthday Grammar Game live on Render.

## What You Have

✅ **Complete Next.js Application** - Ready to run  
✅ **Game Component** - Beautiful, responsive UI  
✅ **Customizable Texts** - JSON file for phrases  
✅ **API Integration** - Claude for feedback  
✅ **Deployment Config** - render.yaml for one-click deploy  

## The Workflow

```
Local Development
    ↓
Push to GitHub
    ↓
Connect to Render
    ↓
Live on Internet! 🌐
```

---

## PHASE 1: Local Development (10 minutes)

### 1.1 Get API Key

Visit https://console.anthropic.com and create an API key. Copy it.

### 1.2 Set Up Your Computer

```bash
# Clone the project (or download it)
cd birthday-grammar-game

# Install all dependencies
npm install
```

### 1.3 Create `.env.local`

Create a file named `.env.local` in the root directory:

```
NEXT_PUBLIC_ANTHROPIC_API_KEY=paste_your_key_here
```

Paste your API key where it says `paste_your_key_here`.

### 1.4 Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

**Test:**
- Click "Let's Play"
- Enter player name
- Type the text shown
- Click Submit
- Should see feedback

### 1.5 Customize Texts (Optional)

Edit `public/game-texts.json` to add your own phrases. Example:

```json
{
  "gameTexts": [
    {
      "id": 1,
      "text": "Happy Birthday to you",
      "difficulty": "easy",
      "hint": "A birthday song"
    }
  ]
}
```

---

## PHASE 2: Push to GitHub (10 minutes)

### 2.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `birthday-grammar-game`
3. Description: "A fun birthday party typing game"
4. **Make it Public** (so Render can access it)
5. Click "Create repository"

### 2.2 Initialize Git Locally

In your project folder:

```bash
git init
git add .
git commit -m "Initial commit: Birthday Grammar Game"
```

### 2.3 Connect to GitHub

In GitHub, after creating the repo, you'll see commands. Run them:

```bash
git remote add origin https://github.com/YOUR_USERNAME/birthday-grammar-game.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 2.4 Verify

Go to your GitHub repo URL and confirm all files are there.

---

## PHASE 3: Deploy to Render (5 minutes)

### 3.1 Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Sign up with GitHub (easiest)

### 3.2 Create Web Service

1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Click "Connect" next to your GitHub repo
4. Search for and select `birthday-grammar-game`
5. Click "Connect"

### 3.3 Configure Deployment

**Fill in these fields:**

- **Name:** `birthday-grammar-game`
- **Runtime:** Node
- **Region:** (leave default)
- **Branch:** main
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`

### 3.4 Add Environment Variables

Click "Advanced" at the bottom, then add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Paste your API key here |
| `NODE_ENV` | `production` |

### 3.5 Deploy!

Click "Create Web Service"

Render will:
1. Pull your code from GitHub
2. Install dependencies
3. Build the app
4. Deploy it live

Takes about 2-3 minutes. You'll see a URL like:
```
https://birthday-grammar-game-abcd.onrender.com
```

---

## PHASE 4: Test Live App (2 minutes)

### 4.1 Visit Your App

Click the URL from Render and test:
- Can you see the game?
- Can you register players?
- Can you play?

### 4.2 Share the Link

Your game is now live! Share the URL with your friends for the birthday party.

---

## Making Changes Later

If you want to update texts or fix bugs:

```bash
# 1. Make changes locally
# Edit game-texts.json or code

# 2. Push to GitHub
git add .
git commit -m "Updated game texts"
git push

# 3. Render automatically redeploys! ✨
# Check Render dashboard for deployment status
```

---

## Troubleshooting

### "API Key invalid" Error
- Check `.env.local` has the correct key
- Make sure NEXT_PUBLIC_ANTHROPIC_API_KEY is set
- Get a new key at https://console.anthropic.com

### "Module not found" Error
```bash
npm install
npm run dev
```

### Game won't load on Render
- Check Render logs (click on your service, see "Logs" tab)
- Verify environment variable is set in Render dashboard
- Make sure render.yaml exists in root

### Files not found in Render
- Check `.gitignore` - make sure you're not ignoring important files
- Run `git status` to see what will be pushed
- `public/game-texts.json` must be committed to Git

### Still not working?
1. Check Render deployment logs for specific errors
2. Verify all files are in the GitHub repository
3. Try redeploying from Render dashboard

---

## Final Checklist

Before the birthday party:

- [ ] Game running locally at localhost:3000
- [ ] `.env.local` has your API key
- [ ] Pushed to GitHub
- [ ] Deployed to Render
- [ ] Tested the live URL
- [ ] Customized `game-texts.json` with your texts
- [ ] Told friends the URL
- [ ] Ready to party! 🎉

---

## Important Notes

### Security
- **Never commit `.env.local` to GitHub** (it's in `.gitignore`)
- Only add API key to Render environment variables
- Don't share your API key with anyone

### Costs
- Render free tier: ✅ Free for this app
- Anthropic API: ✅ Free tier available (some requests included)
- GitHub: ✅ Free

### Uptime
- Render free tier: App goes to sleep after 15 min inactivity
- First request takes ~20 seconds to spin up
- After that: instant!

---

## Commands Cheat Sheet

```bash
# Local development
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)

# Git/GitHub
git init             # Initialize git
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to GitHub
git status           # See what changed

# Render deployment
# (Do this via the Render dashboard)
```

---

## Get Help

- **Render Docs:** https://render.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Help:** https://docs.github.com
- **Anthropic API:** https://docs.anthropic.com

---

## You Did It! 🎉

Your app is now live on the internet and ready for your birthday party!

Enjoy! 🎊🎈🎁
