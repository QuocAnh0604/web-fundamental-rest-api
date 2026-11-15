// bookings/bookings.controller.ts
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get()
  findAll() {
    return this.bookings.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookings.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookings.create(dto);
  }

  @Put(":id")
  replace(@Param("id") id: string, @Body() dto: CreateBookingDto) {
    return this.bookings.replace(id, dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateBookingDto) {
    return this.bookings.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  remove(@Param("id") id: string) {
    this.bookings.remove(id);
  }
}