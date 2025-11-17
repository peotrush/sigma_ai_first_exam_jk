import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

/**
 * User Registration DTO
 * Validates data for POST /auth/register endpoint
 */
export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;
}
