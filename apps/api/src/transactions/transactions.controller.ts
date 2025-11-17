import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
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

@Controller('transactions')
@UseGuards(JwtGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * POST /transactions
   * Create a new transaction
   *
   * Body:
   * {
   *   "amount": 42.50,
   *   "timestamp": "2025-11-17T14:30:00Z",
   *   "source": "qr_scan",
   *   "category": null,
   *   "location": null
   * }
   *
   * Response: 201 Created
   * {
   *   "id": "550e8400-e29b-41d4-a716-446655440000",
   *   "userId": "user-uuid-here",
   *   "amount": 42.50,
   *   "timestamp": "2025-11-17T14:30:00Z",
   *   "source": "qr_scan",
   *   "category": null,
   *   "location": null,
   *   "createdAt": "2025-11-17T15:00:00Z",
   *   "updatedAt": "2025-11-17T15:00:00Z"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: { id: string; email: string },
    @Body(new ValidationPipe({ transform: true }))
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(user.id, createTransactionDto);
  }

  /**
   * GET /transactions?limit=20&offset=0
   * Get user's transactions with pagination
   *
   * Query parameters:
   * - limit: number (default 20, max 100)
   * - offset: number (default 0)
   *
   * Response: 200 OK
   * {
   *   "data": [
   *     {
   *       "id": "550e8400-e29b-41d4-a716-446655440000",
   *       "userId": "user-uuid-here",
   *       "amount": 42.50,
   *       "timestamp": "2025-11-17T14:30:00Z",
   *       "source": "qr_scan",
   *       "category": null,
   *       "location": null,
   *       "createdAt": "2025-11-17T15:00:00Z",
   *       "updatedAt": "2025-11-17T15:00:00Z"
   *     }
   *   ],
   *   "pagination": {
   *     "limit": 20,
   *     "offset": 0,
   *     "total": 1,
   *     "hasMore": false
   *   }
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: { id: string; email: string },
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PaginatedResult<TransactionDto>> {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.transactionsService.getByUser(
      user.id,
      parsedLimit,
      parsedOffset,
    );
  }

  /**
   * GET /transactions/:id
   * Get a single transaction by ID
   *
   * Response: 200 OK with transaction data
   * Response: 400 Bad Request if transaction not found or unauthorized
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
  ): Promise<TransactionDto> {
    return this.transactionsService.getById(id, user.id);
  }

  /**
   * DELETE /transactions/:id
   * Delete a transaction
   *
   * Response: 204 No Content
   * Response: 400 Bad Request if transaction not found or unauthorized
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: { id: string; email: string },
    @Param('id') id: string,
  ): Promise<void> {
    return this.transactionsService.delete(id, user.id);
  }
}
