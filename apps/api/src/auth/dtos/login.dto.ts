import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * User Login DTO
 * Validates data for POST /auth/login endpoint
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
