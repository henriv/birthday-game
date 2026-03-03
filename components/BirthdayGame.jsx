'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Trophy, Lock, LogOut, Users } from 'lucide-react';

export default function BirthdayGame() {
  // Game states: welcome, player-join, waiting, organizer-setup, playing, results, leaderboard
  const [gameState, setGameState] = useState('welcome');
  const [playerName, setPlayerName] = useState('');
  const [organizerPin, setOrganizerPin] = useState('');
  const [players, setPlayers] = useState([]); // {id, name, response, submittedAt, errors}
  const [correctText, setCorrectText] = useState('');
  const [correctTextInput, setCorrectTextInput] = useState('');
  const [roundActive, setRoundActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [roundStartTime, setRoundStartTime] = useState(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const textInputRef = useRef(null);
  const countdownRef = useRef(null);

  const ORGANIZER_PIN = '1234'; // Default PIN - can be customized

  // Handle player join
  const handlePlayerJoin = () => {
    if (!playerName.trim()) return;

    const newPlayer = {
      id: Date.now(),
      name: playerName,
      response: '',
      submittedAt: null,
      errors: 0,
    };

    setPlayers([...players, newPlayer]);
    setPlayerName('');
    textInputRef.current?.focus();
  };

  // Handle organizer access
  const handleOrganizerAccess = () => {
    if (organizerPin === ORGANIZER_PIN) {
      setGameState('organizer-setup');
    } else {
      alert('Invalid PIN');
    }
    setOrganizerPin('');
  };

  // Start the round
  const handleStartRound = () => {
    if (!correctText.trim()) {
      alert('Please enter the correct text first');
      return;
    }
    setRoundActive(true);
    setRoundStartTime(Date.now());
    setSubmitted(false);

    // Reset all player responses
    setPlayers(players.map((p) => ({ ...p, response: '', submittedAt: null, errors: 0 })));

    // Start countdown
    let seconds = 180; // 3 minutes
    countdownRef.current = setInterval(() => {
      setCountdownSeconds(seconds);
      seconds--;
      if (seconds < 0) {
        clearInterval(countdownRef.current);
        handleEndRound();
      }
    }, 1000);
  };

  // End the round and calculate results
  const handleEndRound = () => {
    clearInterval(countdownRef.current);
    setRoundActive(false);

    // Calculate errors and time for each player
    const results = players.map((player) => {
      let errors = 0;
      const userText = player.response || '';
      const correctLen = correctText.length;
      const userLen = userText.length;

      // Count character differences
      for (let i = 0; i < Math.max(correctLen, userLen); i++) {
        if (correctText[i] !== userText[i]) {
          errors++;
        }
      }

      // Add length difference as errors
      errors += Math.abs(correctLen - userLen);

      return {
        ...player,
        errors,
        timeTaken: player.submittedAt ? (player.submittedAt - roundStartTime) / 1000 : 999,
      };
    });

    // Sort by errors (ascending) then by time (ascending)
    const sorted = results.sort((a, b) => {
      if (a.errors !== b.errors) return a.errors - b.errors;
      return a.timeTaken - b.timeTaken;
    });

    setPlayers(results);
    setGameState('leaderboard');
  };

  // Handle player response submission
  const handleSubmitResponse = () => {
    if (!userInput.trim() || !roundActive) return;

    const updatedPlayers = players.map((p) =>
      p.id === currentPlayerId
        ? { ...p, response: userInput, submittedAt: Date.now() }
        : p
    );
    setPlayers(updatedPlayers);
    setUserInput('');
    setSubmitted(true);
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
      // Perfect answer
      const speedBonus = Math.max(0, Math.floor((30 - player.timeTaken) * 2));
      return 100 + speedBonus;
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
            <p className="text-xl text-gray-600">
              Listen, type, compete with friends in real-time!
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setGameState('player-join')}
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

              {players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <Users size={20} /> Players Joined ({players.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {players.map((player, idx) => (
                      <div
                        key={player.id}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-gray-800 font-semibold"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waiting area */}
              {!roundActive && players.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-gray-700 font-semibold">
                    ⏳ Waiting for the organizer to start the round...
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Get ready! Watch for the text to be read aloud.</p>
                </div>
              )}

              {roundActive && (
                <button
                  onClick={() => {
                    setCurrentPlayerId(players[0]?.id);
                    setGameState('waiting');
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
                >
                  Ready to Type! 🎯
                </button>
              )}

              <button
                onClick={() => {
                  setGameState('welcome');
                  setPlayerName('');
                  setPlayers([]);
                }}
                className="w-full bg-gray-300 text-gray-800 px-8 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Waiting/Playing State - Players typing */}
        {gameState === 'waiting' && roundActive && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Round Active! 📢</h2>

              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
                <p className="text-6xl font-bold text-purple-600">
                  {formatTime(countdownSeconds)}
                </p>
                <p className="text-sm text-gray-600 mt-2">Time remaining</p>
              </div>

              {/* Players status */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-700 mb-3">Players Status:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-2 rounded ${
                        player.submittedAt
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <span className="font-semibold">{player.name}</span>
                      <span className="text-sm">
                        {player.submittedAt ? '✓ Submitted' : '⏳ Waiting...'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-lg">
                {submitted ? '✓ Your answer submitted! Wait for others...' : 'Enter your text when ready →'}
              </p>
            </div>

            {!submitted && (
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
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer ✓
                </button>
              </div>
            )}

            {submitted && (
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
                <p className="text-green-800 font-bold">Your response submitted!</p>
                <p className="text-sm text-green-700">Waiting for other players...</p>
              </div>
            )}
          </div>
        )}

        {/* Organizer Setup State */}
        {gameState === 'organizer-setup' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 text-center">🎮 Organizer Panel</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Players Joined: {players.length}
                </label>
                {players.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!roundActive && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-2">
                      Enter Correct Text:
                    </label>
                    <textarea
                      value={correctTextInput}
                      onChange={(e) => setCorrectTextInput(e.target.value)}
                      placeholder="Type the text players will need to match..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 h-24 text-lg"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setCorrectText(correctTextInput);
                      alert('Text set! Click Start Round when ready.');
                    }}
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
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow mt-4"
                      >
                        🎬 Start Round Now!
                      </button>
                    </div>
                  )}
                </>
              )}

              {roundActive && (
                <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-center">
                  <p className="text-red-800 font-bold">Round is ACTIVE</p>
                  <p className="text-sm text-red-700 mt-2">Players are typing...</p>

                  <button
                    onClick={handleEndRound}
                    className="w-full bg-gradient-to-r from-red-700 to-red-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow mt-4"
                  >
                    🛑 End Round & Show Results
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setGameState('welcome');
                  setPlayers([]);
                  setCorrectText('');
                  setCorrectTextInput('');
                  setRoundActive(false);
                }}
                className="w-full bg-gray-300 text-gray-800 px-8 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Exit
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard State */}
        {gameState === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-6xl text-center">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Results!</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-bold text-gray-700 mb-2">Correct Text:</p>
              <p className="text-lg text-gray-800 italic">"{correctText}"</p>
            </div>

            <div className="space-y-3">
              {players
                .sort((a, b) => {
                  if (a.errors !== b.errors) return a.errors - b.errors;
                  return (a.submittedAt || Infinity) - (b.submittedAt || Infinity);
                })
                .map((player, idx) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      idx === 0
                        ? 'bg-gradient-to-r from-yellow-300 to-yellow-200'
                        : idx === 1
                        ? 'bg-gradient-to-r from-gray-300 to-gray-200'
                        : idx === 2
                        ? 'bg-gradient-to-r from-orange-300 to-orange-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-gray-800">{player.name}</p>
                        <p className="text-sm text-gray-600">
                          Errors: {player.errors} | Time: {player.timeTaken?.toFixed(1)}s
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        {calculateScore(player)} pts
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => {
                setGameState('welcome');
                setPlayers([]);
                setCorrectText('');
                setCorrectTextInput('');
                setRoundActive(false);
                setUserInput('');
                setSubmitted(false);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
            >
              New Game 🎉
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
      `}</style>
    </div>
  );
}
