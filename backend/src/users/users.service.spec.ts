import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MemoryStoreService } from '../common/memory-store.service';
import { Role } from '../common/enums';

describe('UsersService', () => {
  let service: UsersService;
  let store: MemoryStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MemoryStoreService,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    store = module.get<MemoryStoreService>(MemoryStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'test@test.com', password: 'pw', role: Role.Participant };
      jest.spyOn(store, 'findUserByEmail').mockReturnValue(user);

      const result = await service.findOne('test@test.com');
      expect(result).toEqual(user);
    });

    it('should return null if not found', async () => {
      jest.spyOn(store, 'findUserByEmail').mockReturnValue(undefined);

      const result = await service.findOne('test@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
        const user = { id: '1', email: 'test@test.com', password: 'pw', role: Role.Participant };
        jest.spyOn(store, 'findUserById').mockReturnValue(user);
  
        const result = await service.findById('1');
        expect(result).toEqual(user);
      });
  });

  describe('createUser', () => {
      it('should create a user', async () => {
        const dto = { email: 'new@test.com', password: 'pw', role: Role.Participant };
        const createdUser = { id: 'new', ...dto };
        jest.spyOn(store, 'createUser').mockReturnValue(createdUser);

        const result = await service.createUser(dto);
        expect(result).toEqual(createdUser);
      });
  });
});
