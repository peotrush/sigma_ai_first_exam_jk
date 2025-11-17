import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { DataSource } from 'typeorm';
import { LoggerService } from '../logger/logger.service';

describe('HealthService', () => {
  let service: HealthService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    // Mock DataSource
    mockDataSource = {
      query: jest.fn(),
    } as any;

    // Mock LoggerService
    mockLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  describe('checkHealth', () => {
    it('should return ok status when database is connected', async () => {
      // Arrange
      mockDataSource.query.mockResolvedValueOnce([{ now: new Date() }]);

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.status).toBe('ok');
      expect(result.database).toBe('connected');
      expect(result.timestamp).toBeDefined();
    });

    it('should return error status when database is disconnected', async () => {
      // Arrange
      mockDataSource.query.mockRejectedValueOnce(
        new Error('Connection refused'),
      );

      // Act
      const result = await service.checkHealth();

      // Assert
      expect(result.status).toBe('error');
      expect(result.database).toBe('disconnected');
      expect(result.timestamp).toBeDefined();
    });

    it('should timeout after 5 seconds', async () => {
      // Arrange
      mockDataSource.query.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(null), 10000); // 10 second delay
          }),
      );

      // Act
      const result = await service.checkHealth();

      // Assert (should timeout and return error)
      expect(result.status).toBe('error');
      expect(result.database).toBe('disconnected');
    });
  });
});
