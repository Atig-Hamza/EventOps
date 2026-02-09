/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { MemoryStoreService } from '../common/memory-store.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventsService } from '../events/events.service';
import { EventStatus, ReservationStatus } from '../common/enums';

@Injectable()
export class ReservationsService {
    constructor(
        private store: MemoryStoreService,
        private eventsService: EventsService,
    ) { }

    async create(userId: string, createReservationDto: CreateReservationDto) {
        const { eventId } = createReservationDto;
        const event = await this.eventsService.findOne(eventId);

        if (event.status !== EventStatus.Published) {
            throw new BadRequestException('Cannot reserve an event that is not published');
        }

        const existingReservation = this.store.findActiveReservation(userId, eventId);

        if (existingReservation) {
            throw new ConflictException('You already have an active reservation for this event');
        }

        const confirmedOrPendingCount = this.store.countReservationsByEvent(eventId, [
            ReservationStatus.Confirmed,
            ReservationStatus.Pending,
        ]);

        if (confirmedOrPendingCount >= event.capacity) {
            throw new BadRequestException('Event is full');
        }

        return this.store.createReservation({
            userId,
            eventId,
            status: ReservationStatus.Pending,
        });
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async findAllByUser(userId: string) {
        return this.store
            .listReservationsByUser(userId)
            .map(reservation => ({
                ...reservation,
                event: this.store.findEventById(reservation.eventId),
            }))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async findAllByEvent(eventId: string) {
        return this.store
            .listReservationsByEvent(eventId)
            .map(reservation => ({
                ...reservation,
                user: this.store.findUserById(reservation.userId),
            }))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async findAllAdmin() {
        return this.store
            .listReservations()
            .map(reservation => ({
                ...reservation,
                event: this.store.findEventById(reservation.eventId),
                user: this.store.findUserById(reservation.userId),
            }))
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async updateStatus(id: string, status: ReservationStatus, userId?: string) {
        const reservation = this.store.findReservationById(id);

        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        if (userId) {
            if (reservation.userId !== userId) {
                throw new BadRequestException('Cannot cancel another user reservation');
            }
            if (status !== ReservationStatus.Canceled) {
                throw new BadRequestException('Participants can only CANCEL their reservation');
            }
        }

        const updated = this.store.updateReservation(id, { status });
        if (!updated) throw new NotFoundException('Reservation not found');
        return updated;
    }
}
