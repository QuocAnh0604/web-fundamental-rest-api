import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplaceReviewDto } from './dto/replace-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('services/:serviceId/reviews')
  findAll(@Param('serviceId') serviceId: string) {
    return this.reviewsService.findByService(serviceId);
  }

  @Post('services/:serviceId/reviews')
  create(@Param('serviceId') serviceId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(serviceId, dto);
  }

  @Get('reviews/:id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Put('reviews/:id')
  replace(@Param('id') id: string, @Body() dto: ReplaceReviewDto) {
    return this.reviewsService.replace(id, dto);
  }

  @Patch('reviews/:id')
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @Delete('reviews/:id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.reviewsService.remove(id);
  }
}