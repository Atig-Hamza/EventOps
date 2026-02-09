import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create user and return token', async () => {
      const dto = { email: 'e', password: 'p', role: Role.Participant };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      // We can't easily mock bcrypt.hash since it's imported as * as bcrypt
      // But we can let it run since it's just a library function

      jest.spyOn(usersService, 'createUser').mockResolvedValue({
        id: '1',
        email: 'e',
        password: 'hashed',
        role: Role.Participant,
      } as any);

      const result = await service.signup(dto);
      expect(result).toHaveProperty('token');
      expect(result.email).toBe('e');
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue({} as any);
      await expect(
        service.signup({ email: 'e', password: 'p' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return token if credentials valid', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email: 'e',
        password: hashedPassword,
        role: Role.Participant,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);

      const result = await service.login({ email: 'e', password });
      expect(result).toHaveProperty('token', 'jwt-token');
    });

    it('should throw Unauthorized if user not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
      await expect(
        service.login({ email: 'e', password: 'p' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized if password wrong', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email: 'e',
        password: hashedPassword,
        role: Role.Participant,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user as any);
      await expect(
        service.login({ email: 'e', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
