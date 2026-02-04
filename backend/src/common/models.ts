import { EventStatus, ReservationStatus, Role } from './enums';

export type User = {
    id: string;
    email: string;
    password: string;
    role: Role;
};

export type Event = {
    id: string;
    title: string;
    description: string;
    dateTime: Date;
    location: string;
    capacity: number;
    status: EventStatus;
};

export type Reservation = {
    id: string;
    eventId: string;
    userId: string;
    status: ReservationStatus;
    createdAt: Date;
};
