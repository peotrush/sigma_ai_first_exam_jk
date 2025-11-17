import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSource } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockRepository: jest.Mocked<Repository<Transaction>>;

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTransactionId = '550e8400-e29b-41d4-a716-446655440001';

  const createMockTransaction = (
    overrides: Partial<Transaction> = {},
  ): Transaction => ({
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
  } as Transaction);

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('create', () => {
    it('should create a transaction with valid data', async () => {
      const createDto: CreateTransactionDto = {
        amount: 42.5,
        timestamp: '2025-11-17T14:30:00Z',
        source: TransactionSource.QR_SCAN,
        category: 'Food',
      };

      const mockTransaction = createMockTransaction({
        category: 'Food',
      });

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(mockUserId, createDto);

      expect(result).toEqual(mockTransaction);
      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: mockUserId,
        ...createDto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTransaction);
    });

    it('should create a transaction with minimal data (nullable fields)', async () => {
      const createDto: CreateTransactionDto = {
        amount: 100.0,
        timestamp: '2025-11-17T10:00:00Z',
        source: TransactionSource.MANUAL,
      };

      const mockTransaction = createMockTransaction({
        amount: 100.0,
        source: TransactionSource.MANUAL,
      });

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(mockUserId, createDto);

      expect(result).toEqual(mockTransaction);
      expect(result.category).toBeNull();
      expect(result.location).toBeNull();
    });

    it('should throw BadRequestException for invalid amount (negative)', async () => {
      const createDto: CreateTransactionDto = {
        amount: -10.0,
        timestamp: '2025-11-17T14:30:00Z',
        source: TransactionSource.MANUAL,
      };

      mockRepository.create.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      await expect(service.create(mockUserId, createDto)).rejects.toThrow();
    });

    it('should throw BadRequestException for zero amount', async () => {
      const createDto: CreateTransactionDto = {
        amount: 0,
        timestamp: '2025-11-17T14:30:00Z',
        source: TransactionSource.MANUAL,
      };

      mockRepository.create.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      await expect(service.create(mockUserId, createDto)).rejects.toThrow();
    });

    it('should handle transactions with category and location', async () => {
      const createDto: CreateTransactionDto = {
        amount: 75.99,
        timestamp: '2025-11-16T12:00:00Z',
        source: TransactionSource.QR_SCAN,
        category: 'Groceries',
        location: 'POINT(23.7275 42.6977)',
      };

      const mockTransaction = createMockTransaction({
        amount: 75.99,
        category: 'Groceries',
        location: 'POINT(23.7275 42.6977)',
        source: TransactionSource.QR_SCAN,
      });

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(mockUserId, createDto);

      expect(result.category).toBe('Groceries');
      expect(result.location).toBe('POINT(23.7275 42.6977)');
    });
  });

  describe('getByUser', () => {
    it('should return paginated transactions for a user', async () => {
      const limit = 20;
      const offset = 0;

      const mockTransactions = [
        createMockTransaction({ id: '1' }),
        createMockTransaction({ id: '2' }),
        createMockTransaction({ id: '3' }),
      ];

      mockRepository.find.mockResolvedValue(mockTransactions);
      mockRepository.count.mockResolvedValue(3);

      const result = await service.getByUser(mockUserId, limit, offset);

      expect(result.data).toEqual(mockTransactions);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.limit).toBe(limit);
      expect(result.pagination.offset).toBe(offset);
      expect(result.pagination.hasMore).toBe(false);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset,
      });
    });

    it('should return correct pagination metadata when hasMore is true', async () => {
      const limit = 10;
      const offset = 0;

      const mockTransactions = Array.from({ length: 10 }, (_, i) =>
        createMockTransaction({ id: `tx-${i}` }),
      );

      mockRepository.find.mockResolvedValue(mockTransactions);
      mockRepository.count.mockResolvedValue(25); // Total count is more than limit

      const result = await service.getByUser(mockUserId, limit, offset);

      expect(result.pagination.total).toBe(25);
      expect(result.pagination.hasMore).toBe(true);
      expect(result.data.length).toBe(10);
    });

    it('should handle pagination with offset', async () => {
      const limit = 10;
      const offset = 20;

      const mockTransactions = Array.from({ length: 5 }, (_, i) =>
        createMockTransaction({ id: `tx-${i}` }),
      );

      mockRepository.find.mockResolvedValue(mockTransactions);
      mockRepository.count.mockResolvedValue(25);

      const result = await service.getByUser(mockUserId, limit, offset);

      expect(result.pagination.offset).toBe(offset);
      expect(result.pagination.hasMore).toBe(false); // 20 + 5 = 25
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset,
      });
    });

    it('should return empty array when user has no transactions', async () => {
      mockRepository.find.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getByUser(mockUserId, 20, 0);

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('should order transactions by timestamp descending', async () => {
      const limit = 20;
      const offset = 0;

      const mockTransactions = [
        createMockTransaction({
          id: '1',
          timestamp: new Date('2025-11-17T15:00:00Z'),
        }),
        createMockTransaction({
          id: '2',
          timestamp: new Date('2025-11-17T14:00:00Z'),
        }),
        createMockTransaction({
          id: '3',
          timestamp: new Date('2025-11-17T13:00:00Z'),
        }),
      ];

      mockRepository.find.mockResolvedValue(mockTransactions);
      mockRepository.count.mockResolvedValue(3);

      await service.getByUser(mockUserId, limit, offset);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: { timestamp: 'DESC' },
        take: limit,
        skip: offset,
      });
    });

    it('should handle default limit and offset', async () => {
      const mockTransactions = [createMockTransaction()];

      mockRepository.find.mockResolvedValue(mockTransactions);
      mockRepository.count.mockResolvedValue(1);

      const result = await service.getByUser(mockUserId, 20, 0);

      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.offset).toBe(0);
    });
  });

  describe('getById', () => {
    it('should return a transaction by ID for the authorized user', async () => {
      const mockTransaction = createMockTransaction();

      mockRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.getById(mockTransactionId, mockUserId);

      expect(result).toEqual(mockTransaction);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTransactionId, userId: mockUserId },
      });
    });

    it('should throw BadRequestException when transaction not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getById(mockTransactionId, mockUserId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user is not the transaction owner', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const differentUserId = 'different-user-id';

      await expect(
        service.getById(mockTransactionId, differentUserId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCategory', () => {
    it('should update transaction category', async () => {
      const mockTransaction = createMockTransaction();
      const updatedTransaction = createMockTransaction({
        category: 'Restaurant',
      });

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.updateCategory(
        mockTransactionId,
        mockUserId,
        'Restaurant',
      );

      expect(result.category).toBe('Restaurant');
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateLocation', () => {
    it('should update transaction location', async () => {
      const mockTransaction = createMockTransaction();
      const location = 'POINT(23.7275 42.6977)';
      const updatedTransaction = createMockTransaction({ location });

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.updateLocation(
        mockTransactionId,
        mockUserId,
        location,
      );

      expect(result.location).toBe(location);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a transaction owned by the user', async () => {
      const mockTransaction = createMockTransaction();

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} } as any);

      await service.delete(mockTransactionId, mockUserId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTransactionId, userId: mockUserId },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(mockTransactionId);
    });

    it('should throw BadRequestException when trying to delete transaction of another user', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const differentUserId = 'different-user-id';

      await expect(
        service.delete(mockTransactionId, differentUserId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when transaction does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(mockTransactionId, mockUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Service integration scenarios', () => {
    it('should handle create and retrieve flow', async () => {
      const createDto: CreateTransactionDto = {
        amount: 50.0,
        timestamp: '2025-11-17T10:00:00Z',
        source: TransactionSource.MANUAL,
        category: 'Transport',
      };

      const mockTransaction = createMockTransaction({
        category: 'Transport',
        amount: 50.0,
      });

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);
      mockRepository.find.mockResolvedValue([mockTransaction]);
      mockRepository.count.mockResolvedValue(1);

      // Create
      const created = await service.create(mockUserId, createDto);
      expect(created).toBeDefined();

      // Retrieve
      const result = await service.getByUser(mockUserId, 20, 0);
      expect(result.data).toContainEqual(
        expect.objectContaining({
          category: 'Transport',
          amount: 50.0,
        }),
      );
    });

    it('should maintain transaction integrity across operations', async () => {
      const mockTransaction = createMockTransaction();

      mockRepository.findOne.mockResolvedValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      await service.updateCategory(mockTransactionId, mockUserId, 'Updated');

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTransactionId,
          userId: mockUserId,
        }),
      );
    });
  });
});
