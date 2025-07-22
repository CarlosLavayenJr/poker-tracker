'use client';

import { useState, useEffect } from 'react';
import { PokerSession } from '../types/poker-session';
import { getAllSessions, getActiveSessions } from '../services/api';
import SessionTracker from '../components/SessionTracker';
import EndSessionForm from '../components/EndSessionForm';
import SessionLog from '../components/SessionLog';
import SessionSummary from '../components/SessionSummary';

export default function Home() {
  // State for sessions
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [activeSession, setActiveSession] = useState<PokerSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const allSessions = await getAllSessions();
      setSessions(allSessions);
      
      // Check for active sessions
      const activeSessions = await getActiveSessions();
      setActiveSession(activeSessions.length > 0 ? activeSessions[0] : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);
  
  // Handle session created/ended/deleted events
  const handleSessionEvent = () => {
    fetchSessions();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Poker Session Tracker</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Show either Session Tracker or End Session Form based on whether there's an active session */}
              {activeSession ? (
                <EndSessionForm 
                  activeSession={activeSession} 
                  onSessionEnded={handleSessionEvent} 
                />
              ) : (
                <SessionTracker onSessionCreated={handleSessionEvent} />
              )}
            </div>
            
            <div className="space-y-6">
              {/* Session Summary */}
              <SessionSummary sessions={sessions} />
              
              {/* Session Log */}
              <SessionLog 
                sessions={sessions} 
                onSessionDeleted={handleSessionEvent} 
              />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Poker Session Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}