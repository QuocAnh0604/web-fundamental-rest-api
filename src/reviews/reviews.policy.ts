// reviews/review.policy.ts
import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { Role } from '../auth/enum/roles.enum';
import type { User } from '../users/entities/user.entity';
import type { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Policy()
export class ReviewPolicy implements PolicyBefore<User> {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Admin qua mọi ability bên dưới (sửa/xóa review vi phạm)
  before(user: User | null) {
    if (user?.role === Role.ADMIN) return true;
  }

  // Dùng ở route: chỉ cần đã đăng nhập
  create(user: User | null) {
    return !!user;
  }

  // Dùng ở service: cần record để so sánh chủ sở hữu
  async update(user: User | null, reviewId: number) {
    if (!user) return false;
    const review = await this.reviewsService.findOne(reviewId);
    return review.userId === user.id;
  }

  async remove(user: User | null, reviewId: number) {
    if (!user) return false;
    const review = await this.reviewsService.findOne(reviewId);
    return review.userId === user.id;
  }
}
