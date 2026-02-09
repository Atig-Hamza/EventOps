import { Global, Module } from '@nestjs/common';
import { MongoStoreService } from './mongo-store.service';

@Global()
@Module({
  providers: [MongoStoreService],
  exports: [MongoStoreService],
})
export class CommonModule {}
