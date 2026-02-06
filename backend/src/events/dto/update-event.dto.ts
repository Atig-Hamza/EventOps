import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { EventStatus } from '../../common/enums';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateEventDto extends PartialType(CreateEventDto) {
    @IsOptional()
    @IsEnum(EventStatus)
    status?: EventStatus;

    @IsOptional()
    @IsDateString()
    dateTime?: string;
}
