import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionSource } from './entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: jest.Mocked<TransactionsService>;

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTransactionId = '550e8400-e29b-41d4-a716-446655440001';
  const mockUser = { id: mockUserId, email: 'test@example.com' };

  const createMockTransactionDto = (
    overrides: Partial<TransactionDto> = {},
  ): TransactionDto => ({
    id: mockTransactionId,
    userId: mockUserId,
    amount: 42.5,
    timestamp: new Date('2025-11-17T14:30:00Z'),
    category: null as any,
    location: null as any,
    source: TransactionSource.QR_SCAN,
    createdAt: new Date('2025-11-17T15:00:00Z'),
    updatedAt: new Date('2025-11-17T15:00:00Z'),
    ...overrides,
  } as TransactionDto);

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      getByUser: jest.fn(),
      getById: jest.fn(),
      updateCategory: jest.fn(),
      updateLocation: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(
      TransactionsService,
    ) as jest.Mocked<TransactionsService>;
  });

  describe('create', () => {
    it('should create a transaction and return 201 Created', async () => {
      const createDto: CreateTransactionDto = {
        amount: 42.5,
        timestamp: '2025-11-17T14:30:00Z',
        source: TransactionSource.QR_SCAN,
        category: 'Food',
      };

      const mockTransaction = createMockTransactionDto({
        category: 'Food',
      });

      service.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(mockUser, createDto);

      expect(result).toEqual(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(mockUserId, createDto);
    });

    it('should create transaction with minimal data', async () => {
      const createDto: CreateTransactionDto = {
        amount: 100.0,
        timestamp: '2025-11-17T10:00:00Z',
        source: TransactionSource.MANUAL,
      };

      const mockTransaction = createMockTransactionDto({
        amount: 100.0,
        source: TransactionSource.MANUAL,
      });

      service.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(mockUser, createDto);

      expect(result).toEqual(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(mockUserId, createDto);
    });

    it('should handle transaction creation with all optional fields', async () => {
      const createDto: CreateTransactionDto = {
        amount: 75.99,
        timestamp: '2025-11-16T12:00:00Z',
        source: TransactionSource.QR_SCAN,
        category: 'Groceries',
        location: 'POINT(23.7275 42.6977)',
      };

      const mockTransaction = createMockTransactionDto({
        amount: 75.99,
        category: 'Groceries',
        location: 'POINT(23.7275 42.6977)',
      });

      service.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(mockUser, createDto);

      expect(result.category).toBe('Groceries');
      expect(result.location).toBe('POINT(23.7275 42.6977)');
    });
  });

  describe('findAll', () => {
    it('should return paginated transactions with default limit and offset', async () => {
      const mockTransactions = [
        createMockTransactionDto({ id: '1' }),
        createMockTransactionDto({ id: '2' }),
      ];

      const mockResult = {
        data: mockTransactions,
        pagination: {
          limit: 20,
          offset: 0,
          total: 2,
          hasMore: false,
        },
      };

      service.getByUser.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser);

      expect(result.data).toEqual(mockTransactions);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.offset).toBe(0);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.hasMore).toBe(false);
      expect(service.getByUser).toHaveBeenCalledWith(mockUserId, 20, 0);
    });

    it('should return paginated transactions with custom limit', async () => {
      const mockTransactions = Array.from({ length: 10 }, (_, i) =>
        createMockTransactionDto({ id: `${i}` }),
      );

      const mockResult = {
        data: mockTransactions,
        pagination: {
          limit: 10,
          offset: 0,
          total: 25,
          hasMore: true,
        },
      };

      service.getByUser.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser, '10', '0');

      expect(result.data.length).toBe(10);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.hasMore).toBe(true);
      expect(service.getByUser).toHaveBeenCalledWith(mockUserId, 10, 0);
    });

    it('should return paginated transactions with custom offset', async () => {
      const mockTransactions = Array.from({ length: 5 }, (_, i) =>
        createMockTransactionDto({ id: `${i}` }),
      );

      const mockResult = {
        data: mockTransactions,
        pagination: {
          limit: 20,
          offset: 20,
          total: 25,
          hasMore: false,
        },
      };

      service.getByUser.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser, '20', '20');

      expect(result.pagination.offset).toBe(20);
      expect(result.pagination.hasMore).toBe(false);
      expect(service.getByUser).toHaveBeenCalledWith(mockUserId, 20, 20);
    });

    it('should handle empty transaction list', async () => {
      const mockResult = {
        data: [],
        pagination: {
          limit: 20,
          offset: 0,
          total: 0,
          hasMore: false,
        },
      };

      service.getByUser.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser);

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });

    it('should parse limit and offset as integers', async () => {
      const mockResult = {
        data: [],
        pagination: {
          limit: 50,
          offset: 100,
          total: 0,
          hasMore: false,
        },
      };

      service.getByUser.mockResolvedValue(mockResult);

      await controller.findAll(mockUser, '50', '100');

      expect(service.getByUser).toHaveBeenCalledWith(mockUserId, 50, 100);
    });
  });

  describe('findOne', () => {
    it('should return a single transaction by ID', async () => {
      const mockTransaction = createMockTransactionDto();

      service.getById.mockResolvedValue(mockTransaction);

      const result = await controller.findOne(mockUser, mockTransactionId);

      expect(result).toEqual(mockTransaction);
      expect(service.getById).toHaveBeenCalledWith(mockTransactionId, mockUserId);
    });

    it('should handle different transaction IDs', async () => {
      const differentId = 'different-transaction-id';
      const mockTransaction = createMockTransactionDto({ id: differentId });

      service.getById.mockResolvedValue(mockTransaction);

      const result = await controller.findOne(mockUser, differentId);

      expect(result.id).toBe(differentId);
      expect(service.getById).toHaveBeenCalledWith(differentId, mockUserId);
    });
  });

  describe('remove', () => {
    it('should delete a transaction and return no content', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.remove(mockUser, mockTransactionId);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(mockTransactionId, mockUserId);
    });

    it('should handle deletion of multiple transactions', async () => {
      service.delete.mockResolvedValue(undefined);

      const id1 = 'transaction-id-1';
      const id2 = 'transaction-id-2';

      await controller.remove(mockUser, id1);
      await controller.remove(mockUser, id2);

      expect(service.delete).toHaveBeenCalledTimes(2);
      expect(service.delete).toHaveBeenNthCalledWith(1, id1, mockUserId);
      expect(service.delete).toHaveBeenNthCalledWith(2, id2, mockUserId);
    });
  });

  describe('Authorization scenarios', () => {
    it('should pass the authenticated user ID to service methods', async () => {
      const differentUser = { id: 'different-user-id', email: 'other@example.com' };
      const createDto: CreateTransactionDto = {
        amount: 50.0,
        timestamp: '2025-11-17T10:00:00Z',
        source: TransactionSource.MANUAL,
      };

      const mockTransaction = createMockTransactionDto();
      service.create.mockResolvedValue(mockTransaction);

      await controller.create(differentUser, createDto);

      expect(service.create).toHaveBeenCalledWith(differentUser.id, createDto);
    });

    it('should respect user isolation when retrieving transactions', async () => {
      const userA = { id: 'user-a', email: 'a@example.com' };
      const userB = { id: 'user-b', email: 'b@example.com' };

      const mockResultA = {
        data: [createMockTransactionDto()],
        pagination: { limit: 20, offset: 0, total: 1, hasMore: false },
      };

      const mockResultB = {
        data: [],
        pagination: { limit: 20, offset: 0, total: 0, hasMore: false },
      };

      service.getByUser
        .mockResolvedValueOnce(mockResultA)
        .mockResolvedValueOnce(mockResultB);

      const resultA = await controller.findAll(userA);
      const resultB = await controller.findAll(userB);

      expect(resultA.data.length).toBe(1);
      expect(resultB.data.length).toBe(0);
      expect(service.getByUser).toHaveBeenNthCalledWith(1, userA.id, 20, 0);
      expect(service.getByUser).toHaveBeenNthCalledWith(2, userB.id, 20, 0);
    });
  });

  describe('Query parameter edge cases', () => {
    it('should handle missing query parameters with defaults', async () => {
      const mockResult = {
        data: [],
        pagination: { limit: 20, offset: 0, total: 0, hasMore: false },
      };

      service.getByUser.mockResolvedValue(mockResult);

      await controller.findAll(mockUser, undefined, undefined);

      expect(service.getByUser).toHaveBeenCalledWith(mockUserId, 20, 0);
    });

    it('should handle string query parameters correctly', async () => {
      const mockResult = {
        data: [],
        pagination: { limit: 5, offset: 10, total: 100, hasMore: true },
      };

      service.getByUser.mockResolvedValue(mockResult);

      await controller.findAll(mockUser, '5', '10');

      expect(service.getByUser).toHaveBeenCalledWith(mockUserId, 5, 10);
    });
  });

  describe('Response format validation', () => {
    it('should return correct response format for create', async () => {
      const createDto: CreateTransactionDto = {
        amount: 99.99,
        timestamp: '2025-11-17T14:30:00Z',
        source: TransactionSource.QR_SCAN,
      };

      const mockTransaction = createMockTransactionDto({
        amount: 99.99,
      });

      service.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(mockUser, createDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('amount');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('category');
      expect(result).toHaveProperty('location');
      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should return correct response format for list', async () => {
      const mockResult = {
        data: [createMockTransactionDto()],
        pagination: {
          limit: 20,
          offset: 0,
          total: 1,
          hasMore: false,
        },
      };

      service.getByUser.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockUser);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('limit');
      expect(result.pagination).toHaveProperty('offset');
      expect(result.pagination).toHaveProperty('total');
      expect(result.pagination).toHaveProperty('hasMore');
    });
  });
});
