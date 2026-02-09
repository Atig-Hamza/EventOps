import { Injectable } from '@nestjs/common';
import { MongoStoreService } from '../common/mongo-store.service';
import { Role } from '../common/enums';
import { User } from '../common/models';

@Injectable()
export class UsersService {
  constructor(private store: MongoStoreService) {}

  async findOne(email: string): Promise<User | null> {
    return (await this.store.findUserByEmail(email)) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return (await this.store.findUserById(id)) ?? null;
  }

  async createUser(data: {
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    return this.store.createUser(data);
  }
}
