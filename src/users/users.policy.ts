// users/user.policy.ts
import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { Role } from '../auth/enum/roles.enum';
import type { User } from './entities/user.entity';

@Policy()
export class UserPolicy implements PolicyBefore<User> {
  before(user: User | null) {
    if (user?.role === Role.ADMIN) return true; // admin qua mọi ability
  }

  list(_user: User | null)   { return false; } // chỉ admin
  remove(_user: User | null) { return false; } // chỉ admin

  // user chỉ truy cập hồ sơ của chính mình
  access(user: User | null, targetId: number) {
    return !!user && user.id === targetId;
  }
}
