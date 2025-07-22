import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokerSessionController } from './poker-session/controller';
import { PokerSessionService } from './poker-session/service';

@Module({
  imports: [],
  controllers: [AppController, PokerSessionController],
  providers: [AppService, PokerSessionService],
})
export class AppModule {}
