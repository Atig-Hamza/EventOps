/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MongoStoreService } from '../common/mongo-store.service';
import { ReservationStatus } from '../common/enums';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class TicketService {
  constructor(private store: MongoStoreService) {}

  async generateTicketPdf(
    reservationId: string,
    userId: string,
  ): Promise<Buffer> {
    const reservation = await this.store.findReservationById(reservationId);
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException('You do not own this reservation');
    }

    if (reservation.status !== ReservationStatus.Confirmed) {
      throw new ForbiddenException(
        'Ticket is only available for confirmed reservations',
      );
    }

    const event = await this.store.findEventById(reservation.eventId);
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.store.findUserById(reservation.userId);

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        size: [600, 320],
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      });

      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ── Background ──
      doc.rect(0, 0, 600, 320).fill('#0a0a0a');

      // ── Left accent bar ──
      doc.rect(0, 0, 6, 320).fill('#ffffff');

      // ── Top decorative line ──
      const gradient = doc.linearGradient(30, 0, 570, 0);
      gradient.stop(0, '#ffffff', 0.1);
      gradient.stop(0.5, '#ffffff', 0.3);
      gradient.stop(1, '#ffffff', 0.1);
      doc.rect(30, 42, 540, 0.5).fill(gradient);

      // ── "TICKET" label ──
      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor('#666666')
        .text('E V E N T  T I C K E T', 30, 20, { width: 540, align: 'left' });

      // ── Ticket ID on right ──
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#555555')
        .text(`#${reservation.id.slice(0, 8).toUpperCase()}`, 30, 20, {
          width: 540,
          align: 'right',
        });

      // ── Event title ──
      doc
        .fontSize(28)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(event.title.toUpperCase(), 30, 58, { width: 400 });

      // ── Dashed separator ──
      const dashY = 130;
      doc.strokeColor('#333333').lineWidth(1);
      for (let x = 30; x < 570; x += 8) {
        doc
          .moveTo(x, dashY)
          .lineTo(x + 4, dashY)
          .stroke();
      }

      // ── Info grid ──
      const infoY = 148;
      const col1 = 30;
      const col2 = 200;
      const col3 = 380;

      // Date
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text('DATE', col1, infoY);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(
          new Date(event.dateTime).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          col1,
          infoY + 16,
        );

      // Time
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text('TIME', col2, infoY);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(
          new Date(event.dateTime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          col2,
          infoY + 16,
        );

      // Location
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text('VENUE', col3, infoY);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(event.location, col3, infoY + 16, { width: 190 });

      // Second row
      const row2Y = infoY + 60;

      // Attendee
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text('ATTENDEE', col1, row2Y);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(user?.email || 'Guest', col1, row2Y + 16);

      // Status
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text('STATUS', col2, row2Y);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#22c55e')
        .text('✓ CONFIRMED', col2, row2Y + 16);

      // Capacity
      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#666666')
        .text('CAPACITY', col3, row2Y);
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text(`${event.capacity} seats`, col3, row2Y + 16);

      // ── Bottom bar ──
      doc.rect(0, 282, 600, 38).fill('#111111');

      // Bottom dashed separator
      doc.strokeColor('#222222').lineWidth(0.5);
      for (let x = 30; x < 570; x += 6) {
        doc
          .moveTo(x, 282)
          .lineTo(x + 3, 282)
          .stroke();
      }

      // Bottom text
      doc
        .fontSize(7)
        .font('Helvetica')
        .fillColor('#555555')
        .text(
          'This ticket is valid for one person only. Please present this ticket at the venue entrance.',
          30,
          294,
          {
            width: 350,
          },
        );

      // EventOps branding bottom-right
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#444444')
        .text('EventOps', 30, 291, { width: 540, align: 'right' });

      doc
        .fontSize(7)
        .font('Helvetica')
        .fillColor('#333333')
        .text('eventops.app', 30, 304, { width: 540, align: 'right' });

      // ── Decorative corner elements ──
      doc.strokeColor('#333333').lineWidth(0.5);
      // Top-right corner
      doc.moveTo(565, 12).lineTo(580, 12).stroke();
      doc.moveTo(580, 12).lineTo(580, 27).stroke();
      // Bottom-left corner
      doc.moveTo(20, 268).lineTo(20, 275).stroke();
      doc.moveTo(20, 275).lineTo(35, 275).stroke();

      doc.end();
    });
  }
}
