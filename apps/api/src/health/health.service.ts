import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HealthCheckResponse } from '@kash/shared';
import { LoggerService } from '../logger/logger.service';

/**
 * Health Check Service
 * Verifies database connectivity and system health
 */
@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Check overall system health
   * Includes database connectivity test
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    const timestamp = new Date().toISOString();

    try {
      const dbStatus = await this.checkDatabaseHealth();

      const health: HealthCheckResponse = {
        status: dbStatus === 'connected' ? 'ok' : 'error',
        database: dbStatus,
        timestamp,
      };

      if (health.status === 'ok') {
        this.logger.debug('Health check passed');
      } else {
        this.logger.warn('Health check failed');
      }

      return health;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error('Health check error', errorMessage);

      return {
        status: 'error',
        database: 'disconnected',
        timestamp,
      };
    }
  }

  /**
   * Check database connectivity by executing a simple query
   */
  private async checkDatabaseHealth(): Promise<'connected' | 'disconnected'> {
    try {
      // Execute a simple query to verify connection
      const connection = this.dataSource.query('SELECT NOW()');
      await Promise.race([
        connection,
        // Timeout after 5 seconds
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Database check timeout')), 5000),
        ),
      ]);

      return 'connected';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error('Database health check failed', errorMessage);
      return 'disconnected';
    }
  }
}
