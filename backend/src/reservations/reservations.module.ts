import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { EventsModule } from '../events/events.module';
import { TicketService } from './ticket.service';

@Module({
  imports: [EventsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, TicketService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
