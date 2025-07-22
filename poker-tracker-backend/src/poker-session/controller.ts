import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PokerSessionService,
  CreatePokerSessionDto,
  UpdatePokerSessionDto,
} from './service';

@Controller('poker-sessions')
export class PokerSessionController {
  constructor(private readonly pokerSessionService: PokerSessionService) {}

  @Post()
  async createSession(@Body() createDto: CreatePokerSessionDto) {
    try {
      return await this.pokerSessionService.createSession(createDto);
    } catch {
      throw new HttpException(
        'Failed to create session',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllSessions() {
    return this.pokerSessionService.findAllSessions();
  }

  @Get('active')
  async getActiveSessions() {
    return this.pokerSessionService.getActiveSessions();
  }

  @Get(':id')
  async getSessionById(@Param('id') id: string) {
    const session = await this.pokerSessionService.findSessionById(id);
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  @Put(':id/end')
  async endSession(
    @Param('id') id: string,
    @Body() updateDto: UpdatePokerSessionDto,
  ) {
    try {
      return await this.pokerSessionService.endSession(id, updateDto);
    } catch {
      throw new HttpException('Failed to end session', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async updateSession(
    @Param('id') id: string,
    @Body() updateDto: UpdatePokerSessionDto,
  ) {
    try {
      return await this.pokerSessionService.updateSession(id, updateDto);
    } catch {
      throw new HttpException(
        'Failed to update session',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string) {
    try {
      return await this.pokerSessionService.deleteSession(id);
    } catch {
      throw new HttpException(
        'Failed to delete session',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
