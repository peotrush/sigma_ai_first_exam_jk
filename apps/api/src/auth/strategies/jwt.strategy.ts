import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

/**
 * JWT Passport Strategy
 * Validates JWT tokens and injects authenticated user into requests
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validate JWT payload
   * Called automatically by Passport after token verification
   *
   * @param payload JWT payload containing sub (user ID) and email
   * @returns Authenticated user entity
   * @throws UnauthorizedException if user not found
   */
  async validate(payload: { sub: string; email: string }) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.authService.validateUser(payload.sub);
    return user;
  }
}
