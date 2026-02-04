import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [CommonModule, UsersModule, AuthModule, EventsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
