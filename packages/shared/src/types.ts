/**
 * Kash Budget - Shared TypeScript Types
 * This file is consumed by both frontend (React Native) and backend (NestJS)
 * to ensure type safety across API contracts
 */

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionSource = 'qr_scan' | 'manual';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  timestamp: Date;
  category?: string;
  location?: LocationData;
  source: TransactionSource;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionRequest {
  amount: number;
  timestamp?: Date;
  category?: string;
  location?: LocationData;
  source: TransactionSource;
  notes?: string;
}

export interface UpdateTransactionRequest {
  category?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  displayOrder: number;
}

export const DEFAULT_CATEGORIES = [
  'Groceries',
  'Dining',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Treat Yourself'
];

// ============================================================================
// LOCATION TYPES
// ============================================================================

export interface LocationData {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface TaggedLocation {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

// ============================================================================
// BUDGET TYPES
// ============================================================================

export interface BudgetGoal {
  id: string;
  userId: string;
  monthYear: string; // "2025-11"
  totalBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryBudgetLimit {
  id: string;
  budgetGoalId: string;
  categoryId: string;
  limitAmount: number;
}

// ============================================================================
// GAMIFICATION TYPES
// ============================================================================

export type CreditTransactionType = 'scan' | 'streak' | 'milestone' | 'unlock';

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // positive for earning, negative for spending
  reason: string;
  transactionType: CreditTransactionType;
  createdAt: Date;
}

export interface UserCredits {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

// ============================================================================
// MESSAGE TYPES (KASH COMMUNICATION)
// ============================================================================

export type KashMessagePose = 'greeting' | 'celebration' | 'thinking' | 'encouraging' | 'warning';

export interface KashMessage {
  id: string;
  userId: string;
  messageText: string;
  pose: KashMessagePose;
  triggerEvent: string;
  readAt?: Date;
  createdAt: Date;
}

// ============================================================================
// INSIGHTS & ANALYTICS TYPES
// ============================================================================

export interface WeeklySpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface WeeklyInsights {
  week: string; // "2025-11-17"
  totalSpending: number;
  byCategory: WeeklySpendingByCategory[];
}

export interface MonthlySummary {
  month: string; // "2025-11"
  totalSpending: number;
  byCategory: Record<string, number>;
  budgetRemaining?: number;
  treatYourselfSpent?: number;
}

// ============================================================================
// API ERROR RESPONSE
// ============================================================================

export interface ApiErrorResponse {
  error: string; // error code
  message: string; // human-readable message
  details?: Record<string, string[]>; // validation errors
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  database?: 'connected' | 'disconnected';
  timestamp: string;
}
