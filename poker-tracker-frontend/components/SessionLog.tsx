'use client';

import { useState } from 'react';
import { PokerSession } from '../types/poker-session';
import { deleteSession } from '../services/api';

interface SessionLogProps {
  sessions: PokerSession[];
  onSessionDeleted: () => void;
}

export default function SessionLog({ sessions, onSessionDeleted }: SessionLogProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time for display
  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format duration for display
  const formatDuration = (minutes: number | undefined): string => {
    if (minutes === undefined) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };
  
  // Handle session deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      
      await deleteSession(id);
      
      // Notify parent component
      onSessionDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Sort sessions by start time (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Session History</h2>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      {sortedSessions.length === 0 ? (
        <p className="text-gray-500">No sessions recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Buy-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cash Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit/Hour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{formatDate(session.startTime)}</div>
                    <div className="text-xs text-gray-500">{formatTime(session.startTime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{session.gameType}</div>
                    <div className="text-xs text-gray-500">{session.environment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDuration(session.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ${session.buyIn.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {session.cashOut != null ? `$${session.cashOut.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.profit != null ? (
                      <span className={`text-sm font-medium ${session.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${session.profit.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.profitPerHour != null ? (
                      <span className={`text-sm font-medium ${session.profitPerHour >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${session.profitPerHour.toFixed(2)}/hr
                      </span>
                    ) : (
                      <span className="text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}