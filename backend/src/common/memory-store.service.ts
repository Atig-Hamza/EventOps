import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Event, Reservation, User } from './models';
import { EventStatus, ReservationStatus, Role } from './enums';

@Injectable()
export class MemoryStoreService {
    private readonly users = new Map<string, User>();
    private readonly events = new Map<string, Event>();
    private readonly reservations = new Map<string, Reservation>();

    createUser(data: { email: string; password: string; role: Role }): User {
        const user: User = { id: randomUUID(), ...data };
        this.users.set(user.id, user);
        return user;
    }

    findUserByEmail(email: string): User | undefined {
        for (const user of this.users.values()) {
            if (user.email === email) return user;
        }
        return undefined;
    }

    findUserById(id: string): User | undefined {
        return this.users.get(id);
    }

    createEvent(data: Omit<Event, 'id' | 'status'>): Event {
        const event: Event = {
            id: randomUUID(),
            status: EventStatus.Draft,
            ...data,
        };
        this.events.set(event.id, event);
        return event;
    }

    updateEvent(id: string, data: Partial<Omit<Event, 'id'>>): Event | undefined {
        const existing = this.events.get(id);
        if (!existing) return undefined;
        const updated: Event = { ...existing, ...data };
        this.events.set(id, updated);
        return updated;
    }

    deleteEvent(id: string): Event | undefined {
        const existing = this.events.get(id);
        if (!existing) return undefined;
        this.events.delete(id);
        for (const reservation of this.reservations.values()) {
            if (reservation.eventId === id) {
                this.reservations.delete(reservation.id);
            }
        }
        return existing;
    }

    findEventById(id: string): Event | undefined {
        return this.events.get(id);
    }

    listEvents(): Event[] {
        return Array.from(this.events.values());
    }

    createReservation(data: { userId: string; eventId: string; status?: ReservationStatus }): Reservation {
        const reservation: Reservation = {
            id: randomUUID(),
            userId: data.userId,
            eventId: data.eventId,
            status: data.status ?? ReservationStatus.Pending,
            createdAt: new Date(),
        };
        this.reservations.set(reservation.id, reservation);
        return reservation;
    }

    updateReservation(id: string, data: Partial<Omit<Reservation, 'id'>>): Reservation | undefined {
        const existing = this.reservations.get(id);
        if (!existing) return undefined;
        const updated: Reservation = { ...existing, ...data };
        this.reservations.set(id, updated);
        return updated;
    }

    findReservationById(id: string): Reservation | undefined {
        return this.reservations.get(id);
    }

    listReservations(): Reservation[] {
        return Array.from(this.reservations.values());
    }

    listReservationsByUser(userId: string): Reservation[] {
        return this.listReservations().filter(reservation => reservation.userId === userId);
    }

    listReservationsByEvent(eventId: string): Reservation[] {
        return this.listReservations().filter(reservation => reservation.eventId === eventId);
    }

    countReservationsByEvent(eventId: string, statuses: ReservationStatus[]): number {
        return this.listReservationsByEvent(eventId).filter(reservation => statuses.includes(reservation.status)).length;
    }

    findActiveReservation(userId: string, eventId: string): Reservation | undefined {
        return this.listReservationsByEvent(eventId).find(
            reservation => reservation.userId === userId && reservation.status !== ReservationStatus.Canceled,
        );
    }
}
