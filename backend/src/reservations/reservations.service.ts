import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MongoStoreService } from '../common/mongo-store.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventsService } from '../events/events.service';
import { EventStatus, ReservationStatus } from '../common/enums';
import { Event, Reservation, User } from '../common/models';

@Injectable()
export class ReservationsService {
  constructor(
    private store: MongoStoreService,
    private eventsService: EventsService,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const { eventId } = createReservationDto;
    const event = await this.eventsService.findOne(eventId);

    if (event.status !== EventStatus.Published) {
      throw new BadRequestException(
        'Cannot reserve an event that is not published',
      );
    }

    const existingReservation = await this.store.findActiveReservation(
      userId,
      eventId,
    );

    if (existingReservation) {
      throw new ConflictException(
        'You already have an active reservation for this event',
      );
    }

    const confirmedOrPendingCount = await this.store.countReservationsByEvent(
      eventId,
      [ReservationStatus.Confirmed, ReservationStatus.Pending],
    );

    if (confirmedOrPendingCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    return this.store.createReservation({
      userId,
      eventId,
      status: ReservationStatus.Pending,
    });
  }

  async findAllByUser(userId: string) {
    const reservations = await this.store.listReservationsByUser(userId);
    const result: (Reservation & { event?: Event })[] = [];
    for (const reservation of reservations) {
      const event = await this.store.findEventById(reservation.eventId);
      result.push({ ...reservation, event });
    }
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findAllByEvent(eventId: string) {
    const reservations = await this.store.listReservationsByEvent(eventId);
    const result: (Reservation & { user?: User })[] = [];
    for (const reservation of reservations) {
      const user = await this.store.findUserById(reservation.userId);
      result.push({ ...reservation, user });
    }
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findAllAdmin() {
    const reservations = await this.store.listReservations();
    const result: (Reservation & { event?: Event; user?: User })[] = [];
    for (const reservation of reservations) {
      const event = await this.store.findEventById(reservation.eventId);
      const user = await this.store.findUserById(reservation.userId);
      result.push({ ...reservation, event, user });
    }
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateStatus(id: string, status: ReservationStatus, userId?: string) {
    const reservation = await this.store.findReservationById(id);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (userId) {
      if (reservation.userId !== userId) {
        throw new BadRequestException('Cannot cancel another user reservation');
      }
      if (status !== ReservationStatus.Canceled) {
        throw new BadRequestException(
          'Participants can only CANCEL their reservation',
        );
      }
    }

    const updated = await this.store.updateReservation(id, { status });
    if (!updated) throw new NotFoundException('Reservation not found');
    return updated;
  }
}
