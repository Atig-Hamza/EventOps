import { Injectable, NotFoundException } from '@nestjs/common';
import { MongoStoreService } from '../common/mongo-store.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, ReservationStatus } from '../common/enums';
import { Event } from '../common/models';

@Injectable()
export class EventsService {
  constructor(private store: MongoStoreService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.store.createEvent({
      ...createEventDto,
      dateTime: new Date(createEventDto.dateTime),
    });
  }

  async findAllPublic(): Promise<Event[]> {
    const events = await this.store.listEvents();
    return events
      .filter((event) => event.status === EventStatus.Published)
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  }

  async findAllAdmin() {
    const events = await this.store.listEvents();
    events.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    const result: (Event & { reservedCount: number })[] = [];
    for (const event of events) {
      const reservedCount = await this.store.countReservationsByEvent(
        event.id,
        [ReservationStatus.Confirmed, ReservationStatus.Pending],
      );
      result.push({ ...event, reservedCount });
    }
    return result;
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.store.findEventById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const data: Record<string, any> = { ...updateEventDto };
    if (updateEventDto.dateTime) {
      data.dateTime = new Date(updateEventDto.dateTime);
    }
    const updated = await this.store.updateEvent(id, data);
    if (!updated) throw new NotFoundException('Event not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.store.deleteEvent(id);
    if (!deleted) throw new NotFoundException('Event not found');
    return deleted;
  }
}
