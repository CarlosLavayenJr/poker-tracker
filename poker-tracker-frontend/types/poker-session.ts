export enum GameType {
  CASH = 'CASH',
  TOURNAMENT = 'TOURNAMENT'
}

export enum Environment {
  ONLINE = 'ONLINE',
  IRL = 'LIVE'
}

export interface PokerSession {
  id: string;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string, optional
  gameType: GameType;
  environment: Environment;
  location: string;
  buyIn: number;
  cashOut?: number; // optional
  duration?: number; // in minutes, optional
  profit?: number; // optional
  profitPerHour?: number; // optional
  isActive: boolean;
}

export interface CreatePokerSessionDto {
  startTime: string; // ISO date string
  gameType: GameType;
  environment: Environment;
  location: string;
  buyIn: number;
}

export interface UpdatePokerSessionDto {
  endTime?: string; // ISO date string
  cashOut?: number;
  location?: string;
}

// Additional interfaces for frontend use
export interface SessionStats {
  totalHours: number;
  totalProfit: number;
  mostProfitableWeek: string;
  bestLocation: string;
}

export interface WeeklySummary {
  week: string;
  totalHours: number;
  totalProfit: number;
}

export interface MonthlySummary {
  month: string;
  totalHours: number;
  totalProfit: number;
}

export interface LocationStats {
  location: string;
  totalHours: number;
  totalProfit: number;
  profitPerHour: number;
}