// api/websocket.js - WebSocket server for real-time game sync
import { WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Game state - shared across all connections
let gameState = {
  players: [],
  correctText: '',
  roundActive: false,
  roundStartTime: null,
};

// Track connections and their user type
const connections = new Map(); // ws -> {id, type: 'admin' | 'player', playerId}

// Broadcast state to all connected clients
function broadcastGameState() {
  const message = JSON.stringify({
    type: 'game-state-update',
    data: gameState,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New connection');

  // Send current game state to new connection
  ws.send(JSON.stringify({
    type: 'initial-state',
    data: gameState,
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const connection = connections.get(ws);

      switch (message.type) {
        case 'register-admin':
          connections.set(ws, { id: Date.now(), type: 'admin' });
          console.log('Admin connected');
          break;

        case 'register-player':
          const playerId = Date.now();
          const newPlayer = {
            id: playerId,
            name: message.playerName,
            response: '',
            submittedAt: null,
            errors: 0,
          };
          gameState.players.push(newPlayer);
          connections.set(ws, { id: playerId, type: 'player', playerId });
          console.log(`Player joined: ${message.playerName}`);
          broadcastGameState();
          break;

        case 'set-correct-text':
          if (connection?.type === 'admin') {
            gameState.correctText = message.text;
            broadcastGameState();
            console.log('Correct text set');
          }
          break;

        case 'start-round':
          if (connection?.type === 'admin') {
            gameState.roundActive = true;
            gameState.roundStartTime = Date.now();
            // Reset responses
            gameState.players.forEach((p) => {
              p.response = '';
              p.submittedAt = null;
              p.errors = 0;
            });
            broadcastGameState();
            console.log('Round started');
          }
          break;

        case 'submit-answer':
          if (connection?.type === 'player') {
            const player = gameState.players.find((p) => p.id === connection.playerId);
            if (player) {
              player.response = message.response;
              player.submittedAt = Date.now();

              // Calculate errors
              let errors = 0;
              const userText = message.response || '';
              const correctLen = gameState.correctText.length;
              const userLen = userText.length;

              for (let i = 0; i < Math.max(correctLen, userLen); i++) {
                if (gameState.correctText[i] !== userText[i]) {
                  errors++;
                }
              }
              errors += Math.abs(correctLen - userLen);
              player.errors = errors;

              broadcastGameState();
              console.log(`Player ${player.name} submitted answer`);
            }
          }
          break;

        case 'end-round':
          if (connection?.type === 'admin') {
            gameState.roundActive = false;
            broadcastGameState();
            console.log('Round ended');
          }
          break;

        case 'reset-game':
          if (connection?.type === 'admin') {
            gameState = {
              players: [],
              correctText: '',
              roundActive: false,
              roundStartTime: null,
            };
            broadcastGameState();
            console.log('Game reset');
          }
          break;
      }
    } catch (error) {
      console.error('Message error:', error);
    }
  });

  ws.on('close', () => {
    const connection = connections.get(ws);
    if (connection?.type === 'player') {
      gameState.players = gameState.players.filter((p) => p.id !== connection.playerId);
      broadcastGameState();
      console.log('Player disconnected');
    }
    connections.delete(ws);
  });
});

// HTTP endpoint for health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
