// app/api/socket/route.js
import { NextResponse } from 'next/server';

// Game state - shared in memory
let gameState = {
  players: [],
  correctText: '',
  roundActive: false,
  roundEnded: false,
  roundStartTime: null,
};

let clients = new Set();

// This is a simpler approach - use polling instead of WebSockets
// which is more compatible with Next.js serverless

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, playerName, text, response, playerId } = body;

    switch (type) {
      case 'register-player':
        const newPlayer = {
          id: Date.now(),
          name: playerName,
          response: '',
          submittedAt: null,
          errors: 0,
        };
        gameState.players.push(newPlayer);
        console.log('Player joined:', playerName);
        return NextResponse.json({ success: true, players: gameState.players });

      case 'set-correct-text':
        gameState.correctText = text;
        console.log('Text set');
        return NextResponse.json({ success: true });

      case 'start-round':
        gameState.roundActive = true;
        gameState.roundEnded = false;
        gameState.roundStartTime = Date.now();
        // Reset responses but keep players
        gameState.players.forEach((p) => {
          p.response = '';
          p.submittedAt = null;
          p.errors = 0;
        });
        return NextResponse.json({ success: true });

      case 'submit-answer':
        const { playerName: submitPlayerName } = body;
        const player = gameState.players.find((p) => p.name === submitPlayerName);
        if (player) {
          player.response = response;
          player.submittedAt = Date.now();

          // Calculate errors
          let errors = 0;
          const userText = response || '';
          const correctLen = gameState.correctText.length;
          const userLen = userText.length;

          for (let i = 0; i < Math.max(correctLen, userLen); i++) {
            if (gameState.correctText[i] !== userText[i]) {
              errors++;
            }
          }
          errors += Math.abs(correctLen - userLen);
          player.errors = errors;
        }
        return NextResponse.json({ success: true });

      case 'end-round':
        gameState.roundActive = false;
        gameState.roundEnded = true;
        // Don't clear players yet - let leaderboard show them
        return NextResponse.json({ success: true });

      case 'new-round':
        gameState.roundActive = false;
        gameState.roundEnded = false;
        gameState.correctText = '';
        gameState.roundStartTime = null;
        // Keep players but clear their responses
        gameState.players.forEach((p) => {
          p.response = '';
          p.submittedAt = null;
          p.errors = 0;
        });
        return NextResponse.json({ success: true });

      case 'clear-players':
        gameState.players = [];
        gameState.roundEnded = false; // Reset for new round
        return NextResponse.json({ success: true });

      case 'get-state':
        return NextResponse.json({ 
          players: gameState.players,
          correctText: gameState.correctText,
          roundActive: gameState.roundActive,
          roundStartTime: gameState.roundStartTime,
        });

      case 'reset':
        gameState = {
          players: [],
          correctText: '',
          roundActive: false,
          roundEnded: false,
          roundStartTime: null,
        };
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    players: gameState.players,
    correctText: gameState.correctText,
    roundActive: gameState.roundActive,
    roundEnded: gameState.roundEnded,
    roundStartTime: gameState.roundStartTime,
  });
}