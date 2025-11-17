import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../database/entities/user.entity';

/**
 * Current User Decorator
 * Injects authenticated user from request
 *
 * Usage:
 * @Get('profile')
 * @UseGuards(JwtGuard)
 * getProfile(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
