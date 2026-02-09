import { Test, TestingModule } from '@nestjs/testing';
import { MemoryStoreService } from './memory-store.service';
import { Role, EventStatus, ReservationStatus } from './enums';

describe('MemoryStoreService', () => {
  let service: MemoryStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoryStoreService],
    }).compile();

    service = module.get<MemoryStoreService>(MemoryStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Users', () => {
    it('should create and find a user', () => {
      const userData = {
        email: 'test@test.com',
        password: 'password',
        role: Role.Participant,
      };
      const user = service.createUser(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);

      const foundUser = service.findUserById(user.id);
      expect(foundUser).toEqual(user);

      const foundByEmail = service.findUserByEmail(userData.email);
      expect(foundByEmail).toEqual(user);
    });

    it('should return undefined for non-existent user', () => {
      expect(service.findUserById('non-existent')).toBeUndefined();
    });
  });

  describe('Events', () => {
    it('should create, find, update and delete an event', () => {
      const eventData = {
        title: 'Test Event',
        description: 'Description',
        dateTime: new Date(),
        location: 'Location',
        capacity: 100,
      };

      // Create
      const event = service.createEvent(eventData);
      expect(event).toBeDefined();
      expect(event.id).toBeDefined();
      expect(event.status).toBe(EventStatus.Draft);

      // Find
      const foundEvent = service.findEventById(event.id);
      expect(foundEvent).toEqual(event);

      // List
      const events = service.listEvents();
      expect(events).toContainEqual(event);

      // Update
      const updatedEvent = service.updateEvent(event.id, {
        title: 'Updated Title',
      });
      expect(updatedEvent.title).toBe('Updated Title');
      expect(service.findEventById(event.id).title).toBe('Updated Title');

      // Delete
      service.deleteEvent(event.id);
      expect(service.findEventById(event.id)).toBeUndefined();
    });

    it('should cascade delete reservations when event is deleted', () => {
      const user = service.createUser({
        email: 'u@u.com',
        password: 'p',
        role: Role.Participant,
      });
      const event = service.createEvent({
        title: 'Event',
        description: 'Desc',
        dateTime: new Date(),
        location: 'Loc',
        capacity: 10,
      });
      const reservation = service.createReservation({
        userId: user.id,
        eventId: event.id,
      });

      expect(service.findReservationById(reservation.id)).toBeDefined();

      service.deleteEvent(event.id);

      expect(service.findReservationById(reservation.id)).toBeUndefined();
    });
  });

  describe('Reservations', () => {
    it('should create and find reservation', () => {
      const user = service.createUser({
        email: 'r@r.com',
        password: 'p',
        role: Role.Participant,
      });
      const event = service.createEvent({
        title: 'Event',
        description: 'D',
        dateTime: new Date(),
        location: 'L',
        capacity: 10,
      });

      const reservation = service.createReservation({
        userId: user.id,
        eventId: event.id,
      });
      expect(reservation).toBeDefined();
      expect(reservation.status).toBe(ReservationStatus.Pending);

      const found = service.findReservationById(reservation.id);
      expect(found).toEqual(reservation);
    });

    it('should update reservation status', () => {
      const user = service.createUser({
        email: 'r2@r.com',
        password: 'p',
        role: Role.Participant,
      });
      const event = service.createEvent({
        title: 'Event',
        description: 'D',
        dateTime: new Date(),
        location: 'L',
        capacity: 10,
      });
      const reservation = service.createReservation({
        userId: user.id,
        eventId: event.id,
      });

      const updated = service.updateReservation(reservation.id, {
        status: ReservationStatus.Confirmed,
      });
      expect(updated.status).toBe(ReservationStatus.Confirmed);
    });
  });
});
