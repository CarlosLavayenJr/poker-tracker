import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  PokerSession,
  GameType,
  Environment,
} from '@prisma/client';

export interface CreatePokerSessionDto {
  startTime: Date;
  gameType: GameType;
  environment: Environment;
  location: string;
  buyIn: number;
}

export interface UpdatePokerSessionDto {
  endTime?: Date | string;
  cashOut?: number;
  location?: string;
}

@Injectable()
export class PokerSessionService {
  private prisma = new PrismaClient();

  async createSession(createDto: CreatePokerSessionDto): Promise<PokerSession> {
    return this.prisma.pokerSession.create({
      data: createDto,
    });
  }

  async findAllSessions(): Promise<PokerSession[]> {
    return this.prisma.pokerSession.findMany({
      orderBy: { startTime: 'desc' },
    });
  }

  async findSessionById(id: string): Promise<PokerSession | null> {
    return this.prisma.pokerSession.findUnique({
      where: { id },
    });
  }

  // In your service.ts
  async endSession(
    id: string,
    updateDto: UpdatePokerSessionDto,
  ): Promise<PokerSession> {
    const session = await this.findSessionById(id);
    if (!session) {
      throw new Error('Session not found');
    }

    // Use current time if endTime not provided
    let endTimeDate = updateDto.endTime 
      ? (typeof updateDto.endTime === 'string' ? new Date(updateDto.endTime) : updateDto.endTime)
      : new Date();

    // Calculate duration in minutes
    const duration = Math.round(
      (endTimeDate.getTime() - session.startTime.getTime()) / (1000 * 60),
    );

    // If cashOut is not provided, profit will be null
    // This is important for your case where you just want to stop the timer
    const profit = updateDto.cashOut !== undefined ? updateDto.cashOut - session.buyIn : null;
    const profitPerHour = profit !== null && duration > 0 ? (profit / duration) * 60 : null;

    return this.prisma.pokerSession.update({
      where: { id },
      data: {
        endTime: endTimeDate,
        duration,
        profit,
        profitPerHour,
        isActive: false,
        // Only include these if they're provided
        ...(updateDto.location ? { location: updateDto.location } : {}),
        ...(updateDto.cashOut !== undefined ? { cashOut: updateDto.cashOut } : {}),
      },
    });
  }

  async updateSession(
    id: string,
    updateDto: UpdatePokerSessionDto,
  ): Promise<PokerSession> {
    return this.prisma.pokerSession.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteSession(id: string): Promise<PokerSession> {
    return this.prisma.pokerSession.delete({
      where: { id },
    });
  }

  async getActiveSessions(): Promise<PokerSession[]> {
    return this.prisma.pokerSession.findMany({
      where: { isActive: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}