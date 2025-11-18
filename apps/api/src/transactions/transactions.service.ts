import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * Create a new transaction for a user
   * Validates that timestamp is not in the future
   */
  async create(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    try {
      const { amount, timestamp, source, type, category, location } =
        createTransactionDto;

      // Validate timestamp is not in the future
      const timestampDate = new Date(timestamp);
      if (timestampDate > new Date()) {
        throw new BadRequestException(
          'Timestamp cannot be in the future',
        );
      }

      // Create and save transaction
      const transaction = this.transactionRepository.create({
        userId,
        amount,
        timestamp: timestampDate,
        source,
        type,
        category: category || null,
        location: location || null,
      });

      const savedTransaction = await this.transactionRepository.save(
        transaction,
      );

      this.logger.debug(
        `Transaction created: ${savedTransaction.id} for user ${userId}`,
      );

      return this.mapToDto(savedTransaction);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error creating transaction for user ${userId}:`,
        error,
      );
      throw new BadRequestException('Failed to create transaction');
    }
  }

  /**
   * Get paginated transactions for a user
   * Ordered by timestamp descending (most recent first)
   */
  async getByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<PaginatedResult<TransactionDto>> {
    try {
      // Validate pagination parameters
      if (limit < 1 || limit > 100) {
        limit = 20;
      }
      if (offset < 0) {
        offset = 0;
      }

      // Query transactions
      const transactions = await this.transactionRepository.find({
        where: { userId },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset,
      });

      const total = await this.transactionRepository.count({
        where: { userId },
      });

      const hasMore = offset + transactions.length < total;

      return {
        data: transactions.map((t) => this.mapToDto(t)),
        pagination: {
          limit,
          offset,
          total,
          hasMore,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching transactions for user ${userId}:`,
        error,
      );
      throw new BadRequestException('Failed to fetch transactions');
    }
  }

  /**
   * Get a single transaction by ID (with user authorization check)
   */
  async getById(id: string, userId: string): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id, userId },
      });

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      return this.mapToDto(transaction);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error fetching transaction ${id} for user ${userId}:`,
        error,
      );
      throw new BadRequestException('Failed to fetch transaction');
    }
  }

  /**
   * Update transaction category (for future categorization service)
   */
  async updateCategory(
    id: string,
    userId: string,
    category: string,
  ): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id, userId },
      });

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      transaction.category = category;
      const updated = await this.transactionRepository.save(transaction);

      this.logger.debug(
        `Transaction ${id} category updated to: ${category}`,
      );

      return this.mapToDto(updated);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error updating transaction ${id} for user ${userId}:`,
        error,
      );
      throw new BadRequestException('Failed to update transaction');
    }
  }

  /**
   * Update transaction location (for future GPS service)
   */
  async updateLocation(
    id: string,
    userId: string,
    location: string,
  ): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id, userId },
      });

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      transaction.location = location;
      const updated = await this.transactionRepository.save(transaction);

      this.logger.debug(
        `Transaction ${id} location updated`,
      );

      return this.mapToDto(updated);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error updating transaction ${id} for user ${userId}:`,
        error,
      );
      throw new BadRequestException('Failed to update transaction');
    }
  }

  /**
   * Delete a transaction
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      const result = await this.transactionRepository.delete({
        id,
        userId,
      });

      if (result.affected === 0) {
        throw new BadRequestException('Transaction not found');
      }

      this.logger.debug(`Transaction ${id} deleted`);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(
        `Error deleting transaction ${id} for user ${userId}:`,
        error,
      );
      throw new BadRequestException('Failed to delete transaction');
    }
  }

  /**
   * Map Transaction entity to TransactionDto
   */
  private mapToDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      category: transaction.category,
      location: transaction.location,
      source: transaction.source,
      type: transaction.type,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}
