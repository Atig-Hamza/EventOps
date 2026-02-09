import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongoStoreService } from '../common/mongo-store.service';
import { Role } from '../common/enums';

describe('UsersService', () => {
  let service: UsersService;
  let store: MongoStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MongoStoreService,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    store = module.get<MongoStoreService>(MongoStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'pw',
        role: Role.Participant,
      };
      jest.spyOn(store, 'findUserByEmail').mockResolvedValue(user);

      const result = await service.findOne('test@test.com');
      expect(result).toEqual(user);
    });

    it('should return null if not found', async () => {
      jest.spyOn(store, 'findUserByEmail').mockResolvedValue(undefined);

      const result = await service.findOne('test@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'pw',
        role: Role.Participant,
      };
      jest.spyOn(store, 'findUserById').mockResolvedValue(user);

      const result = await service.findById('1');
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const dto = {
        email: 'new@test.com',
        password: 'pw',
        role: Role.Participant,
      };
      const createdUser = { id: 'new', ...dto };
      jest.spyOn(store, 'createUser').mockResolvedValue(createdUser);

      const result = await service.createUser(dto);
      expect(result).toEqual(createdUser);
    });
  });
});
