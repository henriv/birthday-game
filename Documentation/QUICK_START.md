# 🚀 Quick Start Guide

Get the Birthday Grammar Game running in 5 minutes!

## Step 1: Get Your API Key (1 minute)

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click "API keys" in the left sidebar
4. Click "Create Key"
5. Copy the key

## Step 2: Set Up Project (2 minutes)

```bash
# Clone or download this project
cd birthday-grammar-game

# Install dependencies
npm install
```

## Step 3: Add Your API Key (1 minute)

Create a file called `.env.local` in the root directory:

```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here_paste_it_now
```

Replace `your_key_here_paste_it_now` with the actual key from Step 1.

## Step 4: Run It! (1 minute)

```bash
npm run dev
```

Open http://localhost:3000 in your browser and start playing!

## Customize Your Game Texts

Edit `public/game-texts.json` to add your own phrases. Example:

```json
{
  "gameTexts": [
    {
      "id": 1,
      "text": "Your custom text here",
      "difficulty": "easy",
      "hint": "A helpful hint"
    },
    {
      "id": 2,
      "text": "Another phrase to type",
      "difficulty": "medium",
      "hint": "Another hint"
    }
  ]
}
```

## Deploy to Render (Free!)

### Option A: Automatic (Easiest)

1. Create a GitHub repo and push this code
2. Go to https://render.com
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repo
6. Add environment variable:
   - Key: `NEXT_PUBLIC_ANTHROPIC_API_KEY`
   - Value: Your API key from Step 1
7. Click "Create Web Service"

Done! Your game is live! 🎉

### Option B: Manual

1. Push code to GitHub
2. In Render, create Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start`
5. Add your API key as environment variable

## Test It Works

1. Visit your app
2. Click "Let's Play"
3. Enter a player name
4. Try typing the text and submitting
5. Should show "Correct!" or feedback

## Troubleshooting

### Error: "NEXT_PUBLIC_ANTHROPIC_API_KEY not found"
- Make sure `.env.local` file exists
- Check the API key is pasted correctly
- Restart dev server (Ctrl+C, then `npm run dev`)

### Error: "Module not found"
```bash
npm install
```

### Texts not showing
- Check `public/game-texts.json` exists
- Make sure JSON syntax is valid (no missing commas/brackets)

## That's It!

Your game is ready to play at your birthday party! 🎊

Next: Customize the texts, invite friends, and have fun! 🎉

---

**Need help?** See README.md for more detailed information.
