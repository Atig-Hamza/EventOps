import { IsIn, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../../common/enums';

export class UpdateReservationStatusDto {
    @IsNotEmpty()
    @IsIn([ReservationStatus.Confirmed, ReservationStatus.Refused, ReservationStatus.Canceled])
    status: ReservationStatus;
}
