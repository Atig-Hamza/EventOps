import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ReservationStatus } from '../common/enums';
import { TicketService } from './ticket.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
    constructor(
        private readonly reservationsService: ReservationsService,
        private readonly ticketService: TicketService,
    ) { }

    @Post()
    @Roles(Role.Participant)
    create(@Request() req: { user: { userId: string } }, @Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.create(req.user.userId, createReservationDto);
    }

    @Get('my')
    @Roles(Role.Participant)
    findAllMyReservations(@Request() req: { user: { userId: string } }) {
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
    cancel(@Request() req: { user: { userId: string } }, @Param('id') id: string) {
        return this.reservationsService.updateStatus(id, ReservationStatus.Canceled, req.user.userId);
    }

    @Get(':id/ticket')
    @Roles(Role.Participant)
    async downloadTicket(
        @Request() req: { user: { userId: string } },
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const pdfBuffer = await this.ticketService.generateTicketPdf(id, req.user.userId);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="ticket-${id.slice(0, 8)}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });
        res.end(pdfBuffer);
    }
}
