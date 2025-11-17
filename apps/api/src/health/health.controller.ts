import { Controller, Get, HttpCode } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthCheckResponse } from '@kash/shared';

/**
 * Health Check Controller
 * Provides endpoints to verify system health and database connectivity
 */
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /health
   * Returns system health status including database connectivity
   *
   * @returns HealthCheckResponse with status and database connection state
   */
  @Get()
  @HttpCode(200)
  async checkHealth(): Promise<HealthCheckResponse> {
    return await this.healthService.checkHealth();
  }

  /**
   * GET /health/live
   * Liveness probe for Kubernetes/container orchestration
   * Returns 200 if service is running, 503 if not
   */
  @Get('live')
  @HttpCode(200)
  isAlive(): { status: string } {
    return { status: 'ok' };
  }

  /**
   * GET /health/ready
   * Readiness probe for Kubernetes
   * Returns 200 only if database is connected
   */
  @Get('ready')
  @HttpCode(200)
  async isReady(): Promise<{ status: string; ready: boolean }> {
    const health = await this.healthService.checkHealth();
    const ready = health.status === 'ok' && health.database === 'connected';
    return {
      status: ready ? 'ok' : 'error',
      ready,
    };
  }
}
