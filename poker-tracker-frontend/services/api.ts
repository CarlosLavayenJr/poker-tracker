import {
  PokerSession,
  CreatePokerSessionDto,
  UpdatePokerSessionDto,
} from '../types/poker-session';

const API_BASE_URL = 'http://localhost:3001';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

// Create a new poker session
export async function createSession(
  sessionData: CreatePokerSessionDto
): Promise<PokerSession> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });
  return handleResponse<PokerSession>(response);
}

// Get all poker sessions
export async function getAllSessions(): Promise<PokerSession[]> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions`);
  return handleResponse<PokerSession[]>(response);
}

// Get active poker sessions
export async function getActiveSessions(): Promise<PokerSession[]> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions/active`);
  return handleResponse<PokerSession[]>(response);
}

// Get a specific poker session by ID
export async function getSessionById(id: string): Promise<PokerSession> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions/${id}`);
  return handleResponse<PokerSession>(response);
}

// End a poker session
export async function endSession(
  id: string,
  updateData: UpdatePokerSessionDto
): Promise<PokerSession> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions/${id}/end`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  return handleResponse<PokerSession>(response);
}

// Update a poker session
export async function updateSession(
  id: string,
  updateData: UpdatePokerSessionDto
): Promise<PokerSession> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  return handleResponse<PokerSession>(response);
}

// Delete a poker session
export async function deleteSession(id: string): Promise<PokerSession> {
  const response = await fetch(`${API_BASE_URL}/poker-sessions/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<PokerSession>(response);
}

// Calculate session statistics
export function calculateSessionStats(sessions: PokerSession[]) {
  // Filter out active sessions and sessions without profit data
  const completedSessions = sessions.filter(
    (session) => !session.isActive && session.profit !== undefined && session.duration !== undefined
  );

  if (completedSessions.length === 0) {
    return {
      totalHours: 0,
      totalProfit: 0,
      mostProfitableWeek: 'N/A',
      bestLocation: 'N/A',
    };
  }

  // Calculate total hours and profit
  const totalMinutes = completedSessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place
  const totalProfit = completedSessions.reduce(
    (sum, session) => sum + (session.profit || 0),
    0
  );

  // Group sessions by week
  const weeklyData = completedSessions.reduce((acc, session) => {
    const date = new Date(session.startTime);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        profit: 0,
        minutes: 0,
      };
    }
    
    acc[weekKey].profit += session.profit || 0;
    acc[weekKey].minutes += session.duration || 0;
    
    return acc;
  }, {} as Record<string, { profit: number; minutes: number }>);

  // Find most profitable week
  let mostProfitableWeek = 'N/A';
  let highestProfit = -Infinity;
  
  Object.entries(weeklyData).forEach(([week, data]) => {
    if (data.profit > highestProfit) {
      highestProfit = data.profit;
      mostProfitableWeek = week;
    }
  });

  // Group sessions by location
  const locationData = completedSessions.reduce((acc, session) => {
    const location = session.location;
    
    if (!acc[location]) {
      acc[location] = {
        profit: 0,
        minutes: 0,
      };
    }
    
    acc[location].profit += session.profit || 0;
    acc[location].minutes += session.duration || 0;
    
    return acc;
  }, {} as Record<string, { profit: number; minutes: number }>);

  // Find best location
  let bestLocation = 'N/A';
  let bestProfitPerHour = -Infinity;
  
  Object.entries(locationData).forEach(([location, data]) => {
    const profitPerHour = data.minutes > 0 ? (data.profit / data.minutes) * 60 : 0;
    if (profitPerHour > bestProfitPerHour) {
      bestProfitPerHour = profitPerHour;
      bestLocation = location;
    }
  });

  return {
    totalHours,
    totalProfit,
    mostProfitableWeek,
    bestLocation,
  };
}

// Get weekly summaries
export function getWeeklySummaries(sessions: PokerSession[]) {
  // Filter out active sessions and sessions without profit data
  const completedSessions = sessions.filter(
    (session) => !session.isActive && session.profit !== undefined && session.duration !== undefined
  );

  if (completedSessions.length === 0) {
    return [];
  }

  // Group sessions by week
  const weeklyData = completedSessions.reduce((acc, session) => {
    const date = new Date(session.startTime);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        profit: 0,
        minutes: 0,
      };
    }
    
    acc[weekKey].profit += session.profit || 0;
    acc[weekKey].minutes += session.duration || 0;
    
    return acc;
  }, {} as Record<string, { profit: number; minutes: number }>);

  // Convert to array and sort by week
  return Object.entries(weeklyData)
    .map(([week, data]) => ({
      week,
      totalHours: Math.round((data.minutes / 60) * 10) / 10,
      totalProfit: data.profit,
    }))
    .sort((a, b) => (a.week > b.week ? -1 : 1)); // Sort by week descending
}

// Get monthly summaries
export function getMonthlySummaries(sessions: PokerSession[]) {
  // Filter out active sessions and sessions without profit data
  const completedSessions = sessions.filter(
    (session) => !session.isActive && session.profit !== undefined && session.duration !== undefined
  );

  if (completedSessions.length === 0) {
    return [];
  }

  // Group sessions by month
  const monthlyData = completedSessions.reduce((acc, session) => {
    const date = new Date(session.startTime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        profit: 0,
        minutes: 0,
      };
    }
    
    acc[monthKey].profit += session.profit || 0;
    acc[monthKey].minutes += session.duration || 0;
    
    return acc;
  }, {} as Record<string, { profit: number; minutes: number }>);

  // Convert to array and sort by month
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      totalHours: Math.round((data.minutes / 60) * 10) / 10,
      totalProfit: data.profit,
    }))
    .sort((a, b) => (a.month > b.month ? -1 : 1)); // Sort by month descending
}

// Get location statistics
export function getLocationStats(sessions: PokerSession[]) {
  // Filter out active sessions and sessions without profit data
  const completedSessions = sessions.filter(
    (session) => !session.isActive && session.profit !== undefined && session.duration !== undefined
  );

  if (completedSessions.length === 0) {
    return [];
  }

  // Group sessions by location
  const locationData = completedSessions.reduce((acc, session) => {
    const location = session.location;
    
    if (!acc[location]) {
      acc[location] = {
        profit: 0,
        minutes: 0,
      };
    }
    
    acc[location].profit += session.profit || 0;
    acc[location].minutes += session.duration || 0;
    
    return acc;
  }, {} as Record<string, { profit: number; minutes: number }>);

  // Convert to array and calculate profit per hour
  return Object.entries(locationData)
    .map(([location, data]) => ({
      location,
      totalHours: Math.round((data.minutes / 60) * 10) / 10,
      totalProfit: data.profit,
      profitPerHour: data.minutes > 0 ? Math.round((data.profit / data.minutes) * 60 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.profitPerHour - a.profitPerHour); // Sort by profit per hour descending
}