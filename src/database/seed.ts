import 'dotenv/config';
import { PasswordHasher } from '@nestjs/authentication';
import { DataSource } from 'typeorm';
import dataSource from './data-source';
import { Role } from '../auth/enum/roles.enum';
import { BookingStatus } from '../bookings/enums/booking-status.enum';
import { Booking } from '../bookings/entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';

const PASSWORD = 'Password123!';

async function seed(source: DataSource): Promise<void> {
  const userRepository = source.getRepository(User);
  const serviceRepository = source.getRepository(Service);
  const bookingRepository = source.getRepository(Booking);
  const reviewRepository = source.getRepository(Review);
  const hasher = new PasswordHasher();
  const passwordHash = await hasher.hash(PASSWORD);

  const upsertUser = async (data: Pick<User, 'name' | 'email' | 'role'>) => {
    let user = await userRepository.findOne({ where: { email: data.email } });
    if (!user) user = userRepository.create({ ...data, passwordHash });
    else {
      user.name = data.name;
      user.role = data.role;
      user.passwordHash = passwordHash;
    }
    return userRepository.save(user);
  };

  const admin = await upsertUser({ name: 'Seed Admin', email: 'admin@example.com', role: Role.ADMIN });
  const user = await upsertUser({ name: 'Seed User', email: 'user@example.com', role: Role.USER });

  const upsertService = async (name: string, capacity: number, price: number) => {
    let service = await serviceRepository.findOne({ where: { name } });
    if (!service) service = serviceRepository.create({ name, capacity, price });
    else Object.assign(service, { capacity, price });
    return serviceRepository.save(service);
  };

  const spa = await upsertService('Seed Spa 60 minutes', 4, 350000);
  const gym = await upsertService('Seed Gym session', 20, 80000);

  const completedBooking = await bookingRepository.findOne({
    where: { userId: user.id, serviceId: spa.id, status: BookingStatus.COMPLETED },
  });
  if (!completedBooking) {
    await bookingRepository.save(bookingRepository.create({
      userId: user.id, serviceId: spa.id, date: '2099-01-15', timeSlot: '10:00-11:00', status: BookingStatus.COMPLETED,
    }));
  }

  const pendingBooking = await bookingRepository.findOne({
    where: { userId: user.id, serviceId: gym.id, status: BookingStatus.PENDING },
  });
  if (!pendingBooking) {
    await bookingRepository.save(bookingRepository.create({
      userId: user.id, serviceId: gym.id, date: '2099-01-16', timeSlot: '14:00-15:00', status: BookingStatus.PENDING,
    }));
  }

  const review = await reviewRepository.findOne({ where: { userId: admin.id, serviceId: spa.id } });
  if (!review) {
    await reviewRepository.save(reviewRepository.create({
      userId: admin.id, serviceId: spa.id, rating: 5, comment: 'Seed review for authorization tests',
    }));
  }

  console.log('Seed completed.');
  console.log(`Admin: ${admin.email} / ${PASSWORD}`);
  console.log(`User: ${user.email} / ${PASSWORD}`);
  console.log(`Services: ${spa.id} (completed booking), ${gym.id} (pending booking)`);
}

dataSource.initialize().then(async (source) => {
  try { await seed(source); }
  finally { await source.destroy(); }
}).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
