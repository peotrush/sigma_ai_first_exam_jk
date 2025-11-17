import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Use @UseGuards(JwtGuard) on controller methods to require authentication
 *
 * Example:
 * @Get('profile')
 * @UseGuards(JwtGuard)
 * getProfile(@CurrentUser() user: UserEntity) {
 *   return user;
 * }
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
