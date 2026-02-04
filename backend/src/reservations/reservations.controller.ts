import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ReservationStatus } from '../common/enums';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    @Roles(Role.Participant)
    create(@Request() req: any, @Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.create(req.user.userId, createReservationDto);
    }

    @Get('my')
    @Roles(Role.Participant)
    findAllMyReservations(@Request() req: any) {
        return this.reservationsService.findAllByUser(req.user.userId);
    }

    @Get('admin')
    @Roles(Role.Admin)
    findAllAdmin(@Query('eventId') eventId?: string) {
        if (eventId) {
            return this.reservationsService.findAllByEvent(eventId);
        }
        return this.reservationsService.findAllAdmin();
    }

    @Patch(':id/status')
    @Roles(Role.Admin)
    updateStatus(@Param('id') id: string, @Body() updateDto: UpdateReservationStatusDto) {
        return this.reservationsService.updateStatus(id, updateDto.status);
    }

    @Patch(':id/cancel')
    @Roles(Role.Participant)
    cancel(@Request() req: any, @Param('id') id: string) {
        return this.reservationsService.updateStatus(id, ReservationStatus.Canceled, req.user.userId);
    }
}
