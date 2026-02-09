/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Event, Reservation, User } from './models';
import { EventStatus, ReservationStatus, Role } from './enums';

@Injectable()
export class MongoStoreService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private usersCol: Collection;
  private eventsCol: Collection;
  private reservationsCol: Collection;

  async onModuleInit() {
    const uri =
      process.env.DATABASE_URL || 'mongodb://localhost:27017/eventops';
    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db();
    this.usersCol = this.db.collection('users');
    this.eventsCol = this.db.collection('events');
    this.reservationsCol = this.db.collection('reservations');

    // Create indexes for fast lookups
    await this.usersCol.createIndex({ email: 1 }, { unique: true });
    await this.eventsCol.createIndex({ status: 1 });
    await this.reservationsCol.createIndex({ userId: 1 });
    await this.reservationsCol.createIndex({ eventId: 1 });
    await this.reservationsCol.createIndex({ userId: 1, eventId: 1 });

    console.log('Connected to MongoDB successfully');
  }

  async onModuleDestroy() {
    await this.client?.close();
  }

  // ── Helpers ──

  private toUser(doc: any): User | undefined {
    if (!doc) return undefined;
    return {
      id: doc._id.toString(),
      email: doc.email as string,
      password: doc.password as string,
      role: doc.role as Role,
    };
  }

  private toEvent(doc: any): Event | undefined {
    if (!doc) return undefined;
    return {
      id: doc._id.toString(),
      title: doc.title as string,
      description: doc.description as string,
      dateTime: new Date(doc.dateTime as string | number | Date),
      location: doc.location as string,
      capacity: doc.capacity as number,
      status: doc.status as EventStatus,
    };
  }

  private toReservation(doc: any): Reservation | undefined {
    if (!doc) return undefined;
    return {
      id: doc._id.toString(),
      eventId: doc.eventId as string,
      userId: doc.userId as string,
      status: doc.status as ReservationStatus,
      createdAt: new Date(doc.createdAt as string | number | Date),
    };
  }

  // ── User Methods ──

  async createUser(data: {
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    const result = await this.usersCol.insertOne({ ...data });
    return { id: result.insertedId.toString(), ...data };
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const doc = await this.usersCol.findOne({ email });
    return this.toUser(doc);
  }

  async findUserById(id: string): Promise<User | undefined> {
    try {
      const doc = await this.usersCol.findOne({ _id: new ObjectId(id) });
      return this.toUser(doc);
    } catch {
      return undefined;
    }
  }

  // ── Event Methods ──

  async createEvent(data: Omit<Event, 'id' | 'status'>): Promise<Event> {
    const eventDoc = { ...data, status: EventStatus.Draft };
    const result = await this.eventsCol.insertOne(eventDoc);
    return {
      id: result.insertedId.toString(),
      status: EventStatus.Draft,
      ...data,
    };
  }

  async updateEvent(
    id: string,
    data: Partial<Omit<Event, 'id'>>,
  ): Promise<Event | undefined> {
    try {
      const result = await this.eventsCol.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' },
      );
      return this.toEvent(result);
    } catch {
      return undefined;
    }
  }

  async deleteEvent(id: string): Promise<Event | undefined> {
    try {
      const existing = await this.eventsCol.findOne({ _id: new ObjectId(id) });
      if (!existing) return undefined;
      await this.eventsCol.deleteOne({ _id: new ObjectId(id) });
      await this.reservationsCol.deleteMany({ eventId: id });
      return this.toEvent(existing);
    } catch {
      return undefined;
    }
  }

  async findEventById(id: string): Promise<Event | undefined> {
    try {
      const doc = await this.eventsCol.findOne({ _id: new ObjectId(id) });
      return this.toEvent(doc);
    } catch {
      return undefined;
    }
  }

  async listEvents(): Promise<Event[]> {
    const docs = await this.eventsCol.find().toArray();
    return docs.map((doc) => this.toEvent(doc)!);
  }

  // ── Reservation Methods ──

  async createReservation(data: {
    userId: string;
    eventId: string;
    status?: ReservationStatus;
  }): Promise<Reservation> {
    const reservationDoc = {
      userId: data.userId,
      eventId: data.eventId,
      status: data.status ?? ReservationStatus.Pending,
      createdAt: new Date(),
    };
    const result = await this.reservationsCol.insertOne(reservationDoc);
    return {
      id: result.insertedId.toString(),
      ...reservationDoc,
    };
  }

  async updateReservation(
    id: string,
    data: Partial<Omit<Reservation, 'id'>>,
  ): Promise<Reservation | undefined> {
    try {
      const result = await this.reservationsCol.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' },
      );
      return this.toReservation(result);
    } catch {
      return undefined;
    }
  }

  async findReservationById(id: string): Promise<Reservation | undefined> {
    try {
      const doc = await this.reservationsCol.findOne({ _id: new ObjectId(id) });
      return this.toReservation(doc);
    } catch {
      return undefined;
    }
  }

  async listReservations(): Promise<Reservation[]> {
    const docs = await this.reservationsCol.find().toArray();
    return docs.map((doc) => this.toReservation(doc)!);
  }

  async listReservationsByUser(userId: string): Promise<Reservation[]> {
    const docs = await this.reservationsCol.find({ userId }).toArray();
    return docs.map((doc) => this.toReservation(doc)!);
  }

  async listReservationsByEvent(eventId: string): Promise<Reservation[]> {
    const docs = await this.reservationsCol.find({ eventId }).toArray();
    return docs.map((doc) => this.toReservation(doc)!);
  }

  async countReservationsByEvent(
    eventId: string,
    statuses: ReservationStatus[],
  ): Promise<number> {
    return this.reservationsCol.countDocuments({
      eventId,
      status: { $in: statuses },
    });
  }

  async findActiveReservation(
    userId: string,
    eventId: string,
  ): Promise<Reservation | undefined> {
    const doc = await this.reservationsCol.findOne({
      userId,
      eventId,
      status: { $ne: ReservationStatus.Canceled },
    });
    return this.toReservation(doc);
  }
}
