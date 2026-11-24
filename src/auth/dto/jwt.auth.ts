// auth/jwt-auth.provider.ts
import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from '@nestjs/authentication';
import type { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super({ realm: 'api' }); // key, issuer, audience lấy từ option accessToken
    registry.registerProvider(this);
  }

  // Chạy sau khi chữ ký và hạn token đã hợp lệ. Trả null nếu user đã bị xóa → token bị từ chối.
  validate({ sub }: JwtClaims) {
    return sub ? this.usersService.findById(Number(sub)) : null;
  }
}
