import { IsPositive, IsDateString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { TransactionSource } from '../entities/transaction.entity';

/**
 * DTO for creating a transaction
 * Validates all required and optional fields
 */
export class CreateTransactionDto {
  /**
   * Transaction amount in BGN currency
   * Must be positive with up to 2 decimal places
   */
  @IsPositive({
    message: 'Amount must be a positive number',
  })
  amount!: number;

  /**
   * Original receipt timestamp (ISO 8601 format)
   * Cannot be in the future
   */
  @IsDateString(
    { strict: true },
    {
      message: 'Timestamp must be a valid ISO 8601 date string',
    },
  )
  timestamp!: string;

  /**
   * Transaction source: QR scan or manual entry
   */
  @IsEnum(TransactionSource, {
    message: `Source must be one of: ${Object.values(TransactionSource).join(', ')}`,
  })
  source!: TransactionSource;

  /**
   * Optional category for transaction
   * Will be filled by categorization service later
   */
  @IsOptional()
  @MaxLength(50, {
    message: 'Category must not exceed 50 characters',
  })
  category?: string;

  /**
   * Optional GPS location (GeoJSON Point format)
   * Will be filled by GPS service later
   */
  @IsOptional()
  location?: string;
}
