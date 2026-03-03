# 🎉 Birthday Grammar Game

A fun, real-time typing game where friends compete to type exact phrases as fast as possible! Perfect for birthday parties.

## Game Features

✅ **No Login Required** - Players just enter their name and play  
✅ **Real-Time Validation** - Instant feedback on submissions  
✅ **Speed Matters** - Faster correct answers earn more points  
✅ **Multi-Player** - Multiple friends can play in turns  
✅ **Leaderboard** - Final rankings with scores  
✅ **Customizable Texts** - Easy to add your own phrases in JSON  

## How It Works

1. **Register Players** - Enter names of all players
2. **Take Turns** - Each player sees a text to type
3. **Type Fast** - Type what you see, submit instantly
4. **Get Points** - Correct + fast = high score
5. **View Rankings** - See final leaderboard at the end

## Quick Setup

### 1. Prerequisites
- Node.js 18+ installed
- An Anthropic API key (get one free at https://console.anthropic.com)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file:
```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run Locally
```bash
npm run dev
```

Visit http://localhost:3000 and start playing!

## Customizing Game Texts

Edit `public/game-texts.json` to add your own phrases:

```json
{
  "gameTexts": [
    {
      "id": 1,
      "text": "Your phrase here",
      "difficulty": "easy",
      "hint": "Optional hint for players"
    }
  ]
}
```

**Difficulty levels:** `easy`, `medium`, `hard`

## Project Structure

```
birthday-game/
├── app/
│   ├── page.js           # Home page
│   ├── layout.js         # Root layout
│   └── globals.css       # Global styles
├── components/
│   └── BirthdayGame.jsx  # Main game component
├── public/
│   └── game-texts.json   # Game phrases (edit this!)
├── package.json
├── .env.local            # Your API key goes here
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## How Scoring Works

**Points = Base Points + Speed Bonus**

- **Base Points:** 100 points for correct answer
- **Speed Bonus:** 2 points per second saved (compared to 30 second baseline)
- **Wrong Answer:** 0 points (plus encouraging message)

Example:
- Answer in 10 seconds → 100 + (30-10)×2 = **140 points**
- Answer in 25 seconds → 100 + (30-25)×2 = **110 points**
- Answer in 40 seconds → 100 + 0 = **100 points** (speed bonus cap)

## Deploying to Render

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/birthday-grammar-game.git
git branch -M main
git push -u origin main
```

### 2. Create Render Web Service
1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Set deployment settings:
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`

### 3. Add Environment Variables
In Render dashboard, add under "Environment":
```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here
```

### 4. Deploy
Click "Create Web Service" and Render will deploy automatically!

## API Integration

The game uses Claude API via `@anthropic-ai/sdk` for:
- Providing feedback when players get answers wrong
- Making the game more interactive

The API key is used **client-side** (in the browser) so make sure it's a valid Anthropic API key.

## Troubleshooting

### "Module not found: lucide-react"
```bash
npm install lucide-react
```

### "API Key error"
- Check `.env.local` has `NEXT_PUBLIC_ANTHROPIC_API_KEY` set
- Ensure the key is valid (get a new one at https://console.anthropic.com)
- Restart dev server after changing `.env.local`

### Game won't load
- Check browser console (F12) for errors
- Verify Node.js version: `node --version` (should be 18+)
- Try: `npm install && npm run dev`

### Texts not loading
- Make sure `public/game-texts.json` exists
- Check the JSON format is valid (use a JSON validator)
- Restart dev server

## Tips for the Birthday Party

1. **Pre-load texts** - Add funny or challenging phrases to `game-texts.json`
2. **Audio cues** - You can read the text aloud to players (they see it too)
3. **Multiple rounds** - Players repeat for each text in the JSON
4. **Prizes** - Give the top scorer a prize!
5. **Difficulty progression** - Start easy, get harder

## Example Custom Texts

```json
{
  "gameTexts": [
    {
      "id": 1,
      "text": "To be or not to be that is the question",
      "difficulty": "medium",
      "hint": "Shakespeare quote"
    },
    {
      "id": 2,
      "text": "The quick brown fox jumps over the lazy dog",
      "difficulty": "easy",
      "hint": "A classic phrase"
    },
    {
      "id": 3,
      "text": "pneumonoultramicroscopicsilicovolcanoconiosis",
      "difficulty": "hard",
      "hint": "The longest word in English!"
    }
  ]
}
```

## Technology Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Anthropic SDK** - AI feedback
- **Lucide Icons** - Beautiful icons

## License

MIT - Use freely!

## Support

If you run into issues:
1. Check the Troubleshooting section above
2. Review console errors (F12 in browser)
3. Check that .env.local is set correctly
4. Make sure game-texts.json is valid JSON

---

**Have fun at the birthday party! 🎉🎊🎈**
