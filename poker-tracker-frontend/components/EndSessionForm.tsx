'use client';

import { useState, useEffect, useRef } from 'react';
import { PokerSession, UpdatePokerSessionDto } from '../types/poker-session';
import { endSession } from '../services/api';

interface EndSessionFormProps {
  activeSession: PokerSession | null;
  onSessionEnded: () => void;
}

export default function EndSessionForm({ activeSession, onSessionEnded }: EndSessionFormProps) {
  const [cashOut, setCashOut] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [profitPerHour, setProfitPerHour] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Timer interval reference
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Format elapsed time as HH:MM:SS
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Set up timer effect
  useEffect(() => {
    if (!activeSession) return;
    
    // Calculate initial elapsed time
    const startTime = new Date(activeSession.startTime);
    const now = new Date();
    const initialElapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    setElapsedTime(initialElapsedSeconds);
    
    // Set up interval to update elapsed time every second
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Clean up interval on unmount or when activeSession changes
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [activeSession]);

  // Calculate profit preview
  const calculateProfitPreview = (cashOutValue: string) => {
    if (!activeSession || !cashOutValue || isNaN(Number(cashOutValue))) {
      setProfit(null);
      setProfitPerHour(null);
      return;
    }

    const cashOutNum = Number(cashOutValue);
    const profitValue = cashOutNum - activeSession.buyIn;
    setProfit(profitValue);

    // Calculate profit per hour if we have a valid duration
    if (activeSession.startTime) {
      const startTime = new Date(activeSession.startTime);
      const now = new Date();
      const durationMs = now.getTime() - startTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      
      if (durationHours > 0) {
        setProfitPerHour(profitValue / durationHours);
      } else {
        setProfitPerHour(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeSession) {
      setError('No active session to end');
      return;
    }
    
    if (!cashOut || isNaN(Number(cashOut)) || Number(cashOut) < 0) {
      setError('Cash out amount must be a non-negative number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const updateData: UpdatePokerSessionDto = {
        cashOut: Number(cashOut),
      };
      
      // Update location if provided
      if (location.trim()) {
        updateData.location = location;
      }
      
      await endSession(activeSession.id, updateData);
      
      // Stop the timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      // Reset form
      setCashOut('');
      setLocation('');
      setProfit(null);
      setProfitPerHour(null);
      
      // Notify parent component
      onSessionEnded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no active session, show a message
  if (!activeSession) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">End Session</h2>
        <p className="text-gray-500">No active session to end.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">End Session</h2>
      
      {/* Session Info */}
      <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-sm text-gray-500">Game:</span>
            <p className="font-medium">{activeSession.gameType}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Environment:</span>
            <p className="font-medium">{activeSession.environment}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Location:</span>
            <p className="font-medium">{activeSession.location}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Buy-In:</span>
            <p className="font-medium">${activeSession.buyIn.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Started:</span>
            <p className="font-medium">
              {new Date(activeSession.startTime).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Session Duration:</span>
            <p className="font-medium text-xl font-mono">
              {formatElapsedTime(elapsedTime)}
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cash Out ($)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            placeholder="Enter cash out amount"
            value={cashOut}
            onChange={(e) => {
              setCashOut(e.target.value);
              calculateProfitPreview(e.target.value);
            }}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Update Location (Optional)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter updated location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {/* Profit Preview */}
        {profit !== null && (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h3 className="font-semibold mb-2">Session Summary</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-sm text-gray-500">Profit/Loss:</span>
                <p className={`font-bold ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${profit.toFixed(2)}
                </p>
              </div>
              {profitPerHour !== null && (
                <div>
                  <span className="text-sm text-gray-500">Profit/Hour:</span>
                  <p className={`font-bold ${profitPerHour >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${profitPerHour.toFixed(2)}/hr
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="text-red-500">{error}</div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ending Session...' : 'End Session'}
          </button>
        </div>
      </form>
    </div>
  );
}