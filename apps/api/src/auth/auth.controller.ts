import { Controller, Post, Body, UseGuards, Get, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto, LoginDto } from './dtos';
import { UserEntity } from '../database/entities/user.entity';
import { AuthResponse, User } from '@kash/shared';

/**
 * Authentication Controller
 * Handles user registration, login, and profile endpoints
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Register a new user with email and password
   *
   * @param registerDto User registration data
   * @returns AuthResponse with user and access token
   *
   * @example
   * {
   *   "email": "user@example.com",
   *   "password": "securePassword123",
   *   "firstName": "John",
   *   "lastName": "Doe"
   * }
   */
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Email already registered or validation error' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(registerDto);
  }

  /**
   * POST /auth/login
   * Login with email and password to get access token
   *
   * @param loginDto User credentials
   * @returns AuthResponse with user and access token
   *
   * @example
   * {
   *   "email": "user@example.com",
   *   "password": "securePassword123"
   * }
   */
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(loginDto);
  }

  /**
   * GET /auth/profile
   * Get authenticated user's profile
   * Requires valid JWT token in Authorization header
   *
   * @param user Current authenticated user (injected by JwtGuard)
   * @returns User profile
   *
   * @example
   * Header: Authorization: Bearer <jwt_token>
   */
  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid or missing token' })
  getProfile(@CurrentUser() user: UserEntity): User {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
