import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

/**
 * Logger Service
 * Provides structured JSON logging with Winston
 * Configured for development (console) and production (CloudWatch)
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';

    // Create Winston logger with appropriate transports
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || (isProduction ? 'warn' : 'debug'),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata(),
        winston.format.json(),
      ),
      transports: [
        // Console output (all environments)
        new winston.transports.Console({
          format: isProduction
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
        }),

        // Error logs to separate file (production)
        ...(isProduction
          ? [
              new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
              }),
            ]
          : []),

        // Combined logs (production only, for CloudWatch)
        ...(isProduction
          ? [
              new winston.transports.File({
                filename: 'logs/combined.log',
              }),
            ]
          : []),
      ],
    });
  }

  /**
   * Log at INFO level (NestJS interface)
   */
  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  /**
   * Log at ERROR level (NestJS interface)
   */
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context });
  }

  /**
   * Log at WARN level (NestJS interface)
   */
  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  /**
   * Log at DEBUG level (custom method)
   */
  debug(message: string, context?: string, metadata?: Record<string, string | number | boolean>): void {
    this.logger.debug(message, { context, ...metadata });
  }

  /**
   * Log verbose (custom method)
   */
  verbose(message: string, context?: string, metadata?: Record<string, string | number | boolean>): void {
    this.logger.info(message, { context, level: 'verbose', ...metadata });
  }
}
