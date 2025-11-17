import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../database/entities/user.entity';
import { LoggerService } from '../logger/logger.service';
import { RegisterDto, LoginDto } from './dtos';
import { AuthResponse, User } from '@kash/shared';

/**
 * Authentication Service
 * Handles user registration, login, and JWT token generation
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Register a new user
   *
   * @param registerDto User registration data (email, password, optional name)
   * @returns AuthResponse with user and access token
   * @throws BadRequestException if email already exists
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(`Registration attempted with existing email: ${email}`);
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      emailVerified: false,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`New user registered: ${email}`);

    // Generate JWT token
    const accessToken = this.generateAccessToken(savedUser);

    return {
      accessToken,
      user: this.mapUserEntity(savedUser),
    };
  }

  /**
   * Login an existing user
   *
   * @param loginDto User login credentials (email, password)
   * @returns AuthResponse with user and access token
   * @throws UnauthorizedException if credentials invalid
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`Login attempted with non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      this.logger.warn(`Failed login attempt for user: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`User logged in: ${email}`);

    // Generate JWT token
    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      user: this.mapUserEntity(user),
    };
  }

  /**
   * Validate JWT token and return user
   * Called by JwtStrategy (Passport)
   *
   * @param userId User ID from JWT payload
   * @returns User entity
   * @throws UnauthorizedException if user not found
   */
  async validateUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Generate JWT access token
   * Token expires in 24 hours
   *
   * @param user User entity
   * @returns Signed JWT token
   */
  private generateAccessToken(user: UserEntity): string {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '24h',
      secret: process.env.JWT_SECRET,
    });
  }

  /**
   * Map UserEntity to User DTO (remove sensitive fields)
   */
  private mapUserEntity(user: UserEntity): User {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
