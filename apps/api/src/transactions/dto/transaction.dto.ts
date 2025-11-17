import { Exclude } from 'class-transformer';
import { TransactionSource } from '../entities/transaction.entity';

/**
 * DTO for returning transaction data in API responses
 * Excludes internal fields and transforms data for client consumption
 */
export class TransactionDto {
  /**
   * Unique transaction identifier (UUID)
   */
  id!: string;

  /**
   * User who owns this transaction (UUID)
   */
  userId!: string;

  /**
   * Transaction amount in BGN currency
   */
  amount!: number;

  /**
   * Original receipt timestamp
   */
  timestamp!: Date;

  /**
   * Transaction category (optional)
   * Null until categorization service processes it
   */
  category!: string | null;

  /**
   * Transaction location (optional)
   * GeoJSON Point format or null
   */
  location!: string | null;

  /**
   * Source of transaction (QR scan or manual entry)
   */
  source!: TransactionSource;

  /**
   * When this transaction was created in the system
   */
  createdAt!: Date;

  /**
   * When this transaction was last updated
   */
  updatedAt!: Date;

  /**
   * User object excluded from response for security
   */
  @Exclude()
  user?: never;
}
