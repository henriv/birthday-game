'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Lock, LogOut, Users } from 'lucide-react';

export default function BirthdayGame() {
  const [gameState, setGameState] = useState('welcome');
  const [organizerPin, setOrganizerPin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [correctText, setCorrectText] = useState('');
  const [correctTextInput, setCorrectTextInput] = useState('');
  const [roundActive, setRoundActive] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(180);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentPlayerName, setCurrentPlayerName] = useState(null);
  const [roundStartTime, setRoundStartTime] = useState(null);

  const textInputRef = useRef(null);
  const countdownRef = useRef(null);
  const pollingRef = useRef(null);

  const ORGANIZER_PIN = '1234';

  // Track player updates for re-rendering
  const [playerUpdateKey, setPlayerUpdateKey] = useState(0);

  // Fetch game state from API
  const fetchGameState = async () => {
    try {
      const response = await fetch('/api/socket');
      const data = await response.json();
      setPlayers(data.players);
      setCorrectText(data.correctText);
      setRoundActive(data.roundActive);
      setRoundEnded(data.roundEnded); // Get from API
      setRoundStartTime(data.roundStartTime);
      setPlayerUpdateKey(prev => prev + 1); // Force re-render
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // Start polling for updates
  useEffect(() => {
    fetchGameState();

    // Poll faster during active rounds
    const interval = roundActive ? 200 : 500;
    pollingRef.current = setInterval(() => {
      fetchGameState();
    }, interval);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [roundActive]);

  // Reset submitted state when new round starts
  useEffect(() => {
    if (roundActive) {
      setSubmitted(false);
      setUserInput('');
    }
  }, [roundActive]);

  // Countdown timer
  useEffect(() => {
    if (!roundActive) return;

    if (!countdownRef.current) {
      let seconds = 180;
      countdownRef.current = setInterval(() => {
        setCountdownSeconds(seconds);
        seconds--;
        if (seconds < 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [roundActive]);

  // Send message to API
  const sendMessage = async (type, data) => {
    try {
      const response = await fetch('/api/socket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data }),
      });
      const result = await response.json();
      await fetchGameState(); // Fetch updated state
      return result;
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  // Handle organizer access
  const handleOrganizerAccess = () => {
    if (organizerPin === ORGANIZER_PIN) {
      setIsAdmin(true);
      setGameState('organizer-setup');
    } else {
      alert('Invalid PIN');
    }
    setOrganizerPin('');
  };

  // Handle player join
  const handlePlayerJoin = () => {
    if (!playerName.trim()) return;
    setCurrentPlayerName(playerName); // Save the player name
    sendMessage('register-player', { playerName });
    setGameState('waiting');
    setPlayerName('');
  };

  // Handle set correct text
  const handleSetCorrectText = () => {
    if (!correctTextInput.trim()) {
      alert('Please enter text');
      return;
    }
    sendMessage('set-correct-text', { text: correctTextInput });
    setCorrectTextInput('');
  };

  // Handle start round
  const handleStartRound = () => {
    if (!correctText.trim()) {
      alert('Please set correct text first');
      return;
    }
    sendMessage('start-round');
    setSubmitted(false); // Reset submitted state for all players
  };

  // Handle submit answer
  const handleSubmitResponse = () => {
    if (!userInput.trim() || !roundActive) return;
    sendMessage('submit-answer', { response: userInput, playerName: currentPlayerName });
    setUserInput('');
    setSubmitted(true);
  };

  // Handle end round
  const handleEndRound = () => {
    sendMessage('end-round');
    setRoundEnded(true);
    // Leaderboard stays until admin starts new round
  };

  // Handle reset game
  const handleResetGame = () => {
    sendMessage('reset');
    setIsAdmin(false);
    setGameState('welcome');
    setPlayers([]);
    setCorrectText('');
    setRoundEnded(false);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate score
  const calculateScore = (player) => {
    if (!player.errors) {
      return 100;
    }
    return Math.max(0, 100 - player.errors * 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome State */}
        {gameState === 'welcome' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6 animate-fade-in">
            <div className="text-6xl">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800">Birthday Typing Game</h1>
            <p className="text-xl text-gray-600">Real-time multiplayer typing competition!</p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setGameState('player-join');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
              >
                Join as Player 👤
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="password"
                  value={organizerPin}
                  onChange={(e) => setOrganizerPin(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleOrganizerAccess()}
                  placeholder="Organizer PIN"
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleOrganizerAccess}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Lock size={18} />
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Player Join State */}
        {gameState === 'player-join' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Join the Game 👥</h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  ref={textInputRef}
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePlayerJoin()}
                  placeholder="Enter your name..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <button
                  onClick={handlePlayerJoin}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-shadow"
                >
                  Roll In
                </button>
              </div>

              <button
                onClick={() => setGameState('welcome')}
                className="w-full bg-gray-300 text-gray-800 px-8 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Waiting State - Players waiting for round */}
        {gameState === 'waiting' && !isAdmin && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Lobby 🎮</h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-center gap-2">
                  <Users size={20} /> Players ({players.length})
                </h3>
                <div className="space-y-2 min-h-12">
                  {players.map((player) => (
                    <div key={player.id} className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded text-gray-800 font-semibold">
                      {player.name}
                    </div>
                  ))}
                </div>
              </div>

              {!roundActive && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 font-semibold">⏳ Waiting for organizer to start...</p>
                </div>
              )}

              {roundActive && !submitted && (
                <>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
                    <p className="text-6xl font-bold text-purple-600">{formatTime(countdownSeconds)}</p>
                    <p className="text-sm text-gray-600 mt-2">Time remaining</p>
                  </div>

                  <div className="space-y-4">
                    <input
                      ref={textInputRef}
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitResponse()}
                      placeholder="Type what you hear..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-lg"
                      autoFocus
                    />
                    <button
                      onClick={handleSubmitResponse}
                      disabled={!userInput.trim()}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                    >
                      Submit Answer ✓
                    </button>
                  </div>
                </>
              )}

              {submitted && (
                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 text-center space-y-4">
                  <p className="text-green-800 font-bold text-lg">✓ Answer submitted!</p>
                  
                  {/* Random fun GIFs while waiting */}
                  <div className="flex justify-center">
                    <img 
                      src={[
                        'https://media.giphy.com/media/3o85xIO33l7RlmLuFO/giphy.gif',
                        'https://media.giphy.com/media/g9aZ66K8KO7wI/giphy.gif',
                        'https://media.giphy.com/media/xT9IgEx8SbQ0teblYQ/giphy.gif',
                        'https://media.giphy.com/media/l0HlTy9x8FZo0XO1i/giphy.gif',
                        'https://media.giphy.com/media/3ohzdKdb7房Kz0B9nwc/giphy.gif',
                        'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif',
                        'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
                        'https://media.giphy.com/media/L95W4z3PpJGAU/giphy.gif',
                      ][Math.floor(Math.random() * 8)]}
                      alt="waiting"
                      className="w-32 h-32 rounded-lg"
                    />
                  </div>

                  {/* Spinner */}
                  <div className="flex justify-center">
                    <div className="animate-spin">
                      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>

                  <p className="text-green-700 font-semibold">Waiting for organizer to close the round...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Organizer Panel */}
        {gameState === 'organizer-setup' && isAdmin && !roundEnded && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 text-center">🎮 Organizer Panel</h2>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-bold text-gray-700 mb-2">Players Joined: {players.length}</p>
                <div className="space-y-2 min-h-12">
                  {players.map((p) => (
                    <div key={p.id} className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded text-gray-800 text-sm font-semibold">
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>

              {!roundActive && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-2">Correct Text:</label>
                    <textarea
                      value={correctTextInput}
                      onChange={(e) => setCorrectTextInput(e.target.value)}
                      placeholder="Enter the text players must match..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 h-24"
                    />
                  </div>

                  <button
                    onClick={handleSetCorrectText}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
                  >
                    Set Correct Text
                  </button>

                  {correctText && (
                    <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                      <p className="text-green-800 font-semibold">✓ Text Set:</p>
                      <p className="text-green-700 italic">"{correctText}"</p>
                      <button
                        onClick={handleStartRound}
                        className="w-full bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg mt-4"
                      >
                        🎬 Start Round Now!
                      </button>
                    </div>
                  )}
                </>
              )}

              {roundActive && (
                <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-center">
                  <p className="text-red-800 font-bold mb-4">🔴 Round is ACTIVE</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                    <h4 className="font-bold text-gray-700 text-left">Player Status (Live):</h4>
                    {players && players.length > 0 ? (
                      players.map((p) => (
                        <div
                          key={`${p.id}-${p.submittedAt}`}
                          className={`p-3 rounded font-semibold text-left flex items-center justify-between transition-all ${
                            p.submittedAt
                              ? 'bg-green-200 text-green-800 border-2 border-green-500'
                              : 'bg-yellow-200 text-yellow-800 border-2 border-yellow-500'
                          }`}
                        >
                          <span>{p.name}</span>
                          <span className="text-sm">
                            {p.submittedAt ? `✅ SUBMITTED (${new Date(p.submittedAt).getSeconds()}s)` : '⏳ TYPING...'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No players yet</p>
                    )}
                  </div>
                  <button
                    onClick={handleEndRound}
                    className="w-full bg-red-700 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg mt-4"
                  >
                    🛑 End Round & Show Results
                  </button>
                </div>
              )}

              <button
                onClick={handleResetGame}
                className="w-full bg-gray-300 text-gray-800 px-8 py-2 rounded-lg font-bold hover:bg-gray-400 flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Exit
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard - Show to PLAYERS after round ends */}
        {roundEnded && players.length > 0 && !isAdmin && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-6xl text-center">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Round Results!</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-bold text-gray-700 mb-2">Correct Text:</p>
              <p className="text-lg text-gray-800 italic font-mono">"{correctText}"</p>
            </div>

            <div className="space-y-4">
              {[...players]
                .sort((a, b) => {
                  if (a.errors !== b.errors) return a.errors - b.errors;
                  return (a.submittedAt || Infinity) - (b.submittedAt || Infinity);
                })
                .map((player, idx) => (
                  <div
                    key={player.id}
                    className={`p-4 rounded-lg space-y-2 ${
                      idx === 0
                        ? 'bg-yellow-100 border-2 border-yellow-400'
                        : idx === 1
                        ? 'bg-gray-100 border-2 border-gray-400'
                        : idx === 2
                        ? 'bg-orange-100 border-2 border-orange-400'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">#{idx + 1} {player.name}</p>
                        <p className="text-sm text-gray-600">Errors: {player.errors}</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{calculateScore(player)} pts</p>
                    </div>

                    {/* Show player's response with mistakes */}
                    <div className="mt-3 pt-3 border-t border-gray-300 space-y-2">
                      <p className="text-xs font-bold text-gray-600">YOUR RESPONSE:</p>
                      <div className="bg-white p-3 rounded border-2 border-red-300">
                        <p className="font-mono text-sm relative">
                          {/* Strikethrough response */}
                          <span className="inline-block relative">
                            {player.response || '(no response)'}
                            <span className="absolute left-0 top-1/2 w-full h-0.5 bg-red-500"></span>
                          </span>
                        </p>
                        {/* Correct text above */}
                        <p className="font-mono text-sm text-green-700 font-bold mt-1">
                          ✓ {correctText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <p className="text-center text-gray-600 text-sm">Waiting for organizer to start next round...</p>
          </div>
        )}

        {/* Results View - Show to ADMIN only after round ends */}
        {roundEnded && players.length > 0 && isAdmin && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-6xl text-center">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Round Results</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-bold text-gray-700 mb-2">Correct Text:</p>
              <p className="text-lg text-gray-800 italic">"{correctText}"</p>
            </div>

            <div className="space-y-3">
              {[...players]
                .sort((a, b) => {
                  if (a.errors !== b.errors) return a.errors - b.errors;
                  return (a.submittedAt || Infinity) - (b.submittedAt || Infinity);
                })
                .map((player, idx) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      idx === 0
                        ? 'bg-yellow-200'
                        : idx === 1
                        ? 'bg-gray-200'
                        : idx === 2
                        ? 'bg-orange-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-gray-800">#{idx + 1} {player.name}</p>
                      <p className="text-sm text-gray-600">Errors: {player.errors}</p>
                    </div>
                    <p className="text-2xl font-bold">{calculateScore(player)} pts</p>
                  </div>
                ))}
            </div>

            <button
              onClick={() => {
                sendMessage('clear-players');
                setRoundEnded(false);
                setCorrectText('');
                setCorrectTextInput('');
                setPlayers([]);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
            >
              Start New Round 🎬
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
