// bookings/bookings.service.ts
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ServicesService } from "../services/services.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

export interface Booking {
  id: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  status: string;
}

const writableFields = ["serviceId", "date", "timeSlot", "customerName"] as const;

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];
  private nextBookingNumber = 1;

  constructor(private readonly services: ServicesService) {}

  findAll() {
    return this.bookings;
  }

  findOne(id: string) {
    const booking = this.bookings.find((item) => item.id === id);
    if (!booking) {
      throw new NotFoundException({ message: "Booking not found" });
    }
    return booking;
  }

  create(dto: CreateBookingDto) {
    const missing = writableFields.filter((field) => !dto[field]);
    if (missing.length > 0) {
      throw new BadRequestException({ message: missing.join(", ") + " are required" });
    }
    this.services.findOne(dto.serviceId);

    const booking: Booking = {
      id: "bkg_" + String(this.nextBookingNumber).padStart(3, "0"),
      serviceId: dto.serviceId,
      date: dto.date,
      timeSlot: dto.timeSlot,
      customerName: dto.customerName,
      status: "PENDING",
    };
    this.nextBookingNumber += 1;
    this.bookings.push(booking);
    return booking;
  }

  replace(id: string, dto: CreateBookingDto) {
    const booking = this.findOne(id);

    const missing = writableFields.filter((field) => !dto[field]);
    if (missing.length > 0) {
      throw new BadRequestException({ message: missing.join(", ") + " are required" });
    }
    this.services.findOne(dto.serviceId);

    booking.serviceId = dto.serviceId;
    booking.date = dto.date;
    booking.timeSlot = dto.timeSlot;
    booking.customerName = dto.customerName;
    return booking;
  }

  update(id: string, dto: UpdateBookingDto) {
    const booking = this.findOne(id);

    const fields = writableFields.filter((field) => dto[field]);
    if (fields.length === 0) {
      throw new BadRequestException({
        message: "At least one of serviceId, date, timeSlot, customerName is required",
      });
    }
    if (dto.serviceId) {
      this.services.findOne(dto.serviceId);
    }

    fields.forEach((field) => {
      booking[field] = dto[field] as string;
    });
    return booking;
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException({ message: "Booking not found" });
    }
    this.bookings.splice(index, 1);
  }
}