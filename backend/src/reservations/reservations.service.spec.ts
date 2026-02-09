import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { MongoStoreService } from '../common/mongo-store.service';
import { EventsService } from '../events/events.service';
import { EventStatus, ReservationStatus } from '../common/enums';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let store: MongoStoreService;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: MongoStoreService,
          useValue: {
            findActiveReservation: jest.fn(),
            countReservationsByEvent: jest.fn(),
            createReservation: jest.fn(),
            listReservationsByUser: jest.fn(),
            listReservationsByEvent: jest.fn(),
            listReservations: jest.fn(),
            findEventById: jest.fn(),
            findUserById: jest.fn(),
            findReservationById: jest.fn(),
            updateReservation: jest.fn(),
          },
        },
        {
          provide: EventsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    store = module.get<MongoStoreService>(MongoStoreService);
    eventsService = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create reservation', async () => {
      const event = { id: '1', status: EventStatus.Published, capacity: 10 };
      jest.spyOn(eventsService, 'findOne').mockResolvedValue(event as any);
      jest.spyOn(store, 'findActiveReservation').mockResolvedValue(undefined);
      jest.spyOn(store, 'countReservationsByEvent').mockResolvedValue(0);
      jest
        .spyOn(store, 'createReservation')
        .mockResolvedValue({ id: 'res1' } as any);

      const result = await service.create('user1', { eventId: '1' });
      expect(result).toEqual({ id: 'res1' });
    });

    it('should throw if event not published', async () => {
      jest
        .spyOn(eventsService, 'findOne')
        .mockResolvedValue({ status: EventStatus.Draft } as any);
      await expect(service.create('u', { eventId: '1' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if already reserved', async () => {
      jest
        .spyOn(eventsService, 'findOne')
        .mockResolvedValue({ status: EventStatus.Published } as any);
      jest.spyOn(store, 'findActiveReservation').mockResolvedValue({} as any);
      await expect(service.create('u', { eventId: '1' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw if event is full', async () => {
      const event = { id: '1', status: EventStatus.Published, capacity: 1 };
      jest.spyOn(eventsService, 'findOne').mockResolvedValue(event as any);
      jest.spyOn(store, 'findActiveReservation').mockResolvedValue(undefined);
      jest.spyOn(store, 'countReservationsByEvent').mockResolvedValue(1);

      await expect(service.create('u', { eventId: '1' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      const res = { id: '1', userId: 'u1' };
      jest.spyOn(store, 'findReservationById').mockResolvedValue(res as any);
      jest.spyOn(store, 'updateReservation').mockResolvedValue({
        ...res,
        status: ReservationStatus.Confirmed,
      } as any);

      const result = await service.updateStatus(
        '1',
        ReservationStatus.Confirmed,
      );
      expect(result.status).toBe(ReservationStatus.Confirmed);
    });

    it('should throw if participant tries to confirm', async () => {
      const res = { id: '1', userId: 'u1' };
      jest.spyOn(store, 'findReservationById').mockResolvedValue(res as any);

      // Passing user ID implies participant action
      await expect(
        service.updateStatus('1', ReservationStatus.Confirmed, 'u1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow participant to cancel', async () => {
      const res = { id: '1', userId: 'u1' };
      jest.spyOn(store, 'findReservationById').mockResolvedValue(res as any);
      jest.spyOn(store, 'updateReservation').mockResolvedValue({
        ...res,
        status: ReservationStatus.Canceled,
      } as any);

      const result = await service.updateStatus(
        '1',
        ReservationStatus.Canceled,
        'u1',
      );
      expect(result.status).toBe(ReservationStatus.Canceled);
    });
  });
});
