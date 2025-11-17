import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

/**
 * TypeORM configuration for Kash Budget
 * Supports both development (local) and production (AWS RDS) environments
 */
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'kash',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'kash_budget',

  // Connection pooling
  extra: {
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
  },

  // Entities - path to entity files
  entities: [path.join(__dirname, '../database/entities/*.entity{.ts,.js}')],

  // Migrations
  migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
  migrationsRun: process.env.NODE_ENV === 'production', // Auto-run migrations in production

  // Logging
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  logger: 'advanced-console', // More detailed logging

  // Synchronization (ONLY for development, never production)
  synchronize: process.env.NODE_ENV === 'development',

  // Connection timeout
  connectTimeoutMS: 30000,

  // SSL for production (AWS RDS)
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,

  // Retry strategy (helps with connection failures in development)
  retryAttempts: process.env.NODE_ENV === 'development' ? 5 : 3,
  retryDelay: 3000,
};
