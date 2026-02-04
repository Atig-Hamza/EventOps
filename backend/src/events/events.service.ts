import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryStoreService } from '../common/memory-store.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus, ReservationStatus } from '../common/enums';
import { Event } from '../common/models';

@Injectable()
export class EventsService {
    constructor(private store: MemoryStoreService) { }

    async create(createEventDto: CreateEventDto): Promise<Event> {
        return this.store.createEvent({
            ...createEventDto,
            dateTime: new Date(createEventDto.dateTime),
        });
    }

    async findAllPublic(): Promise<Event[]> {
        return this.store
            .listEvents()
            .filter(event => event.status === EventStatus.Published)
            .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
    }

    async findAllAdmin() {
        const events = this.store
            .listEvents()
            .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

        return events.map(event => ({
            ...event,
            reservedCount: this.store.countReservationsByEvent(event.id, [
                ReservationStatus.Confirmed,
                ReservationStatus.Pending,
            ]),
        }));
    }

    async findOne(id: string): Promise<Event> {
        const event = this.store.findEventById(id);
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto) {
        const data: any = { ...updateEventDto };
        if (updateEventDto.dateTime) {
            data.dateTime = new Date(updateEventDto.dateTime);
        }
        const updated = this.store.updateEvent(id, data);
        if (!updated) throw new NotFoundException('Event not found');
        return updated;
    }

    async remove(id: string) {
        const deleted = this.store.deleteEvent(id);
        if (!deleted) throw new NotFoundException('Event not found');
        return deleted;
    }
}
