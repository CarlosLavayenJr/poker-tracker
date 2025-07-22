'use client';

import { useState } from 'react';
import { GameType, Environment, CreatePokerSessionDto } from '../types/poker-session';
import { createSession } from '../services/api';

export default function SessionTracker({ onSessionCreated }: { onSessionCreated: () => void }) {
  // Form state
  const [gameType, setGameType] = useState<GameType>(GameType.CASH);
  const [environment, setEnvironment] = useState<Environment>(Environment.IRL);
  const [location, setLocation] = useState<string>('');
  const [buyIn, setBuyIn] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Start tracking session
  const startTracking = async () => {
    try {
      // Validate form
      if (!location) {
        setError('Location is required');
        return;
      }
      
      if (!buyIn || isNaN(Number(buyIn)) || Number(buyIn) <= 0) {
        setError('Buy-in must be a positive number');
        return;
      }
      
      setError(null);
      setIsSubmitting(true);
      
      // Create session data
      const sessionData: CreatePokerSessionDto = {
        startTime: new Date().toISOString(),
        gameType,
        environment,
        location,
        buyIn: Number(buyIn),
      };
      
      // Create session in backend
      await createSession(sessionData);
      
      // Reset form
      setGameType(GameType.CASH);
      setEnvironment(Environment.IRL);
      setLocation('');
      setBuyIn('');
      
      // Notify parent component
      onSessionCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Start New Session</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Game Type</label>
          <select
            className="w-full p-2 border rounded-md"
            value={gameType}
            onChange={(e) => setGameType(e.target.value as GameType)}
          >
            <option value={GameType.CASH}>Cash Game</option>
            <option value={GameType.TOURNAMENT}>Tournament</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Environment</label>
          <select
            className="w-full p-2 border rounded-md"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as Environment)}
          >
            <option value={Environment.IRL}>Live</option>
            <option value={Environment.ONLINE}>Online</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location/App</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter location or app name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Buy-In ($)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            placeholder="Enter buy-in amount"
            value={buyIn}
            onChange={(e) => setBuyIn(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      {/* Action Button */}
      <div className="flex justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full"
          onClick={startTracking}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Starting Session...' : 'Start Session'}
        </button>
      </div>
    </div>
  );
}