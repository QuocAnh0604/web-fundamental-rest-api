import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReplaceReviewDto } from './dto/replace-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

export interface Review {
  id: string;
  serviceId: string;
  authorName: string;
  rating: number;
  comment: string;
}

const reviewFields = ['authorName', 'rating', 'comment'] as const;

@Injectable()
export class ReviewsService {
  private readonly reviews: Review[] = [
    { id: 'rev_001', serviceId: 'svc_001', authorName: 'Anh', rating: 5, comment: 'Good service' },
    { id: 'rev_002', serviceId: 'svc_001', authorName: 'Minh', rating: 4, comment: 'Very good' },
    { id: 'rev_003', serviceId: 'svc_002', authorName: 'Nam', rating: 3, comment: 'Average' },
  ];
  private nextReviewNumber = this.reviews.length + 1;

  constructor(private readonly services: ServicesService) {}

  findByService(serviceId: string) {
    this.services.findOne(serviceId); // 404 nếu service không tồn tại
    return this.reviews.filter((review) => review.serviceId === serviceId);
  }

  findOne(id: string) {
    const review = this.reviews.find((item) => item.id === id);
    if (!review) {
      throw new NotFoundException({ message: 'Review not found' });
    }
    return review;
  }

  create(serviceId: string, dto: CreateReviewDto) {
    this.services.findOne(serviceId); // không còn Number()
    const review: Review = {
      id: 'rev_' + String(this.nextReviewNumber).padStart(3, '0'),
      serviceId,
      authorName: dto.authorName,
      rating: dto.rating,
      comment: dto.comment ?? '',
    };
    this.nextReviewNumber += 1;
    this.reviews.push(review);
    return review;
  }

  replace(id: string, dto: ReplaceReviewDto) {
    const review = this.findOne(id);
    review.authorName = dto.authorName;
    review.rating = dto.rating;
    review.comment = dto.comment;
    return review;
  }

  update(id: string, dto: UpdateReviewDto) {
    const review = this.findOne(id);
    if (!reviewFields.some((field) => dto[field] !== undefined)) {
      throw new BadRequestException({ message: 'At least one of authorName, rating, comment is required' });
    }
    if (dto.authorName !== undefined) review.authorName = dto.authorName;
    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment;
    return review;
  }

  remove(id: string): void {
    const index = this.reviews.findIndex((review) => review.id === id);
    if (index === -1) {
      throw new NotFoundException({ message: 'Review not found' });
    }
    this.reviews.splice(index, 1);
  }
}