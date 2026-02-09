import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { MongoStoreService } from '../common/mongo-store.service';
import { EventStatus } from '../common/enums';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let store: MongoStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: MongoStoreService,
          useValue: {
            createEvent: jest.fn(),
            listEvents: jest.fn(),
            countReservationsByEvent: jest.fn(),
            findEventById: jest.fn(),
            updateEvent: jest.fn(),
            deleteEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    store = module.get<MongoStoreService>(MongoStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const dto = {
        title: 'T',
        description: 'D',
        dateTime: new Date().toISOString(),
        location: 'L',
        capacity: 10,
      };
      const expected = {
        id: '1',
        ...dto,
        dateTime: new Date(dto.dateTime),
        status: EventStatus.Draft,
      };
      jest.spyOn(store, 'createEvent').mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAllPublic', () => {
    it('should return published events sorted by date', async () => {
      const now = new Date();
      const events = [
        {
          id: '1',
          title: 'E1',
          dateTime: new Date(now.getTime() + 1000),
          status: EventStatus.Published,
        },
        { id: '2', title: 'E2', dateTime: now, status: EventStatus.Published },
        { id: '3', title: 'E3', dateTime: now, status: EventStatus.Draft },
      ];
      jest.spyOn(store, 'listEvents').mockResolvedValue(events as any);

      const result = await service.findAllPublic();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('2'); // Earlier date first
      expect(result[1].id).toBe('1');
    });
  });

  describe('findAllAdmin', () => {
    it('should return all events with reservation count', async () => {
      const events = [{ id: '1', dateTime: new Date() }];
      jest.spyOn(store, 'listEvents').mockResolvedValue(events as any);
      jest.spyOn(store, 'countReservationsByEvent').mockResolvedValue(5);

      const result = await service.findAllAdmin();
      expect(result[0]).toHaveProperty('reservedCount', 5);
    });
  });

  describe('findOne', () => {
    it('should return event', async () => {
      const event = { id: '1' };
      jest.spyOn(store, 'findEventById').mockResolvedValue(event as any);
      expect(await service.findOne('1')).toEqual(event);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(store, 'findEventById').mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update event', async () => {
      const event = { id: '1', title: 'New' };
      jest.spyOn(store, 'updateEvent').mockResolvedValue(event as any);
      const result = await service.update('1', { title: 'New' });
      expect(result).toEqual(event);
    });

    it('should throw NotFoundException on update', async () => {
      jest.spyOn(store, 'updateEvent').mockResolvedValue(undefined);
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });
});
