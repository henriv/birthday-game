'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, CheckCircle, XCircle, Volume2, Trophy } from 'lucide-react';

export default function BirthdayGame() {
  const [gameState, setGameState] = useState('welcome'); // welcome, register, playing, result, final
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTextId, setCurrentTextId] = useState(0);
  const [gameTexts, setGameTexts] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // {correct: bool, message: string, points: number}
  const [startTime, setStartTime] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const textInputRef = useRef(null);

  // Load game texts
  useEffect(() => {
    fetch('/game-texts.json')
      .then((res) => res.json())
      .then((data) => setGameTexts(data.gameTexts))
      .catch((err) => console.error('Failed to load game texts:', err));
  }, []);

  const handleRegisterPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, { name: playerName, score: 0, rounds: 0 }]);
      setPlayerName('');
      textInputRef.current?.focus();
    }
  };

  const startGame = () => {
    if (players.length === 0) {
      alert('Please register at least one player!');
      return;
    }
    setGameState('playing');
    setCurrentPlayerIndex(0);
    setCurrentTextId(0);
    setStartTime(Date.now());
    setCurrentText(gameTexts[0]?.text || '');
  };

  const validateSubmission = async () => {
    if (!userInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const expectedText = currentText;
      const submittedText = userInput.trim();
      const isExactMatch = submittedText === expectedText;

      let points = 0;
      let message = '';

      if (isExactMatch) {
        // Calculate points based on speed (faster = more points)
        const timeTaken = (Date.now() - startTime) / 1000; // seconds
        const basePoints = 100;
        const speedBonus = Math.max(0, Math.floor((30 - timeTaken) * 2)); // Lose 2 points per second over 30s
        points = basePoints + speedBonus;
        message = `Perfect! 🎉 You got it in ${timeTaken.toFixed(1)}s`;
      } else {
        message = `Not quite right.\n\nExpected: "${expectedText}"\nYou typed: "${submittedText}"`;
        points = 0;
      }

      // Update player score
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += points;
      updatedPlayers[currentPlayerIndex].rounds += 1;
      setPlayers(updatedPlayers);

      setResult({
        correct: isExactMatch,
        message,
        points,
      });

      setGameState('result');
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        correct: false,
        message: 'Error validating. Try again!',
        points: 0,
      });
      setGameState('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextRound = () => {
    const nextTextId = currentTextId + 1;

    if (nextTextId >= gameTexts.length) {
      // Move to next player
      const nextPlayerIndex = currentPlayerIndex + 1;
      if (nextPlayerIndex >= players.length) {
        // Game over - all players done all texts
        setGameState('final');
        return;
      }
      setCurrentPlayerIndex(nextPlayerIndex);
      setCurrentTextId(0);
    } else {
      setCurrentTextId(nextTextId);
    }

    setCurrentText(gameTexts[nextTextId >= gameTexts.length ? 0 : nextTextId]?.text || '');
    setUserInput('');
    setResult(null);
    setStartTime(Date.now());
    setGameState('playing');
  };

  // Focus input when playing
  useEffect(() => {
    if (gameState === 'playing' && textInputRef.current) {
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  }, [gameState]);

  // Calculate rankings
  const rankings = [...players]
    .map((player, idx) => ({ ...player, originalIndex: idx }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome State */}
        {gameState === 'welcome' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6 animate-fade-in">
            <div className="text-6xl">🎉</div>
            <h1 className="text-4xl font-bold text-gray-800">Birthday Grammar Game</h1>
            <p className="text-xl text-gray-600">
              Listen to the text, type what you hear, and race against your friends!
            </p>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>How to play:</strong> Register all players, then take turns typing the
                text you hear. Exact match required! Speed matters!
              </p>
            </div>
            <button
              onClick={() => setGameState('register')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
            >
              Let's Play! 🚀
            </button>
          </div>
        )}

        {/* Register State */}
        {gameState === 'register' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Who's Playing? 👥</h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  ref={textInputRef}
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRegisterPlayer()}
                  placeholder="Enter player name..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleRegisterPlayer}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-shadow"
                >
                  Add
                </button>
              </div>

              {players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-700">Registered Players:</h3>
                  <div className="flex flex-wrap gap-2">
                    {players.map((player, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-gray-800 font-semibold"
                      >
                        {player.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              disabled={players.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Game! 🎮
            </button>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            {/* Player info */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {players[currentPlayerIndex]?.name}'s Turn
              </h2>
              <p className="text-sm text-gray-600">
                Text {currentTextId + 1} of {gameTexts.length}
              </p>
            </div>

            {/* Difficulty badge */}
            <div className="flex justify-center">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold text-sm">
                {gameTexts[currentTextId]?.difficulty?.toUpperCase() || 'NORMAL'}
              </div>
            </div>

            {/* The text to hear (visual aid) */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-700">Text to match:</h3>
                <button
                  onClick={() => {
                    // Could add text-to-speech here
                    alert(`Listen: "${currentText}"`);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <p className="text-xl font-mono text-gray-800 text-center py-4">
                "{currentText}"
              </p>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700">Type what you hear:</label>
              <input
                ref={textInputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && validateSubmission()}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-lg"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {/* Submit button */}
            <button
              onClick={validateSubmission}
              disabled={!userInput.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Checking...' : 'Submit Answer'}
            </button>

            {/* Hint */}
            {gameTexts[currentTextId]?.hint && (
              <p className="text-sm text-gray-600 text-center italic">
                💡 Hint: {gameTexts[currentTextId].hint}
              </p>
            )}
          </div>
        )}

        {/* Result State */}
        {gameState === 'result' && result && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in text-center">
            {result.correct ? (
              <>
                <div className="text-6xl">✨</div>
                <h2 className="text-3xl font-bold text-green-600">Correct!</h2>
                <p className="text-xl text-gray-700">{result.message}</p>
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-4xl font-bold text-green-600">+{result.points} points</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl">😅</div>
                <h2 className="text-3xl font-bold text-red-600">Not Quite</h2>
                <p className="text-lg text-gray-700">{result.message}</p>
                <div className="bg-red-100 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-600">0 points</p>
                </div>
              </>
            )}

            <button
              onClick={goToNextRound}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
            >
              Next Round →
            </button>
          </div>
        )}

        {/* Final State - Rankings */}
        {gameState === 'final' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fade-in">
            <div className="text-6xl text-center">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Game Over!</h2>
            <h3 className="text-2xl font-bold text-gray-700 text-center">Final Rankings</h3>

            <div className="space-y-3">
              {rankings.map((player, idx) => (
                <div
                  key={idx}
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
                    <span className="text-xl font-bold text-gray-800">{player.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{player.score} pts</p>
                    <p className="text-sm text-gray-600">{player.rounds} rounds</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setGameState('welcome');
                setPlayers([]);
                setCurrentPlayerIndex(0);
                setCurrentTextId(0);
                setUserInput('');
                setResult(null);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
            >
              Play Again! 🎉
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
