import { Injectable } from '@nestjs/common';
import { MemoryStoreService } from '../common/memory-store.service';
import { Role } from '../common/enums';
import { User } from '../common/models';

@Injectable()
export class UsersService {
  constructor(private store: MemoryStoreService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async findOne(email: string): Promise<User | null> {
    return this.store.findUserByEmail(email) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<User | null> {
    return this.store.findUserById(id) ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async createUser(data: {
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    return this.store.createUser(data);
  }
}
