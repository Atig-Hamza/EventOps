import { Injectable } from '@nestjs/common';
import { MemoryStoreService } from '../common/memory-store.service';
import { Role } from '../common/enums';
import { User } from '../common/models';

@Injectable()
export class UsersService {
    constructor(private store: MemoryStoreService) { }

    async findOne(email: string): Promise<User | null> {
        return this.store.findUserByEmail(email) ?? null;
    }

    async findById(id: string): Promise<User | null> {
        return this.store.findUserById(id) ?? null;
    }

    async createUser(data: { email: string; password: string; role: Role }): Promise<User> {
        return this.store.createUser(data);
    }
}
