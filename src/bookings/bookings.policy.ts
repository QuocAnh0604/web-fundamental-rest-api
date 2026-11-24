import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { Role } from '../auth/enum/roles.enum';
import type { User } from '../users/entities/user.entity';
import { BookingsService } from './bookings.service';

@Policy()
export class BookingPolicy implements PolicyBefore<User> {
  constructor(private readonly bookingsService: BookingsService) {}

  before(user: User | null) {
    if (user?.role === Role.ADMIN) return true;
  }

  // --- route ---
  create(user: User | null)        { return !!user; }
  viewMine(user: User | null)      { return !!user; }
  changeStatus(_user: User | null) { return false; } // chỉ admin

  // --- service ---
  viewAll(_user: User | null)    { return false; }          // chỉ admin
  assignUser(_user: User | null) { return false; }          // chỉ admin đặt/đổi userId

  async view(user: User | null, bookingId: number) {
    if (!user) return false;
    const booking = await this.bookingsService.findOne(bookingId);
    return booking.userId === user.id;
  }

  async update(user: User | null, bookingId: number) {
    if (!user) return false;
    const booking = await this.bookingsService.findOne(bookingId);
    return booking.userId === user.id && booking.status === 'PENDING';
  }

  async remove(user: User | null, bookingId: number) {
    if (!user) return false;
    const booking = await this.bookingsService.findOne(bookingId);
    return booking.userId === user.id && booking.status === 'PENDING';
  }

  async cancel(user: User | null, bookingId: number) {
    if (!user) return false;
    const booking = await this.bookingsService.findOne(bookingId);
    return booking.userId === user.id && ['PENDING', 'CONFIRMED'].includes(booking.status);
  }
}
