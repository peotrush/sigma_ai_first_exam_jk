import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

/**
 * Database Module
 * Exports all database entities for use throughout the application
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      // TODO: Import additional entities here
      // - TransactionEntity
      // - CategoryEntity
      // - TaggedLocationEntity
      // - BudgetGoalEntity
      // - CategoryBudgetLimitEntity
      // - CreditTransactionEntity
      // - KashMessageEntity
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
