/**
 * Kash Budget - Shared TypeScript Types
 * This file is consumed by both frontend (React Native) and backend (NestJS)
 * to ensure type safety across API contracts
 */
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
export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    isDefault: boolean;
    displayOrder: number;
}
export declare const DEFAULT_CATEGORIES: string[];
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
export interface BudgetGoal {
    id: string;
    userId: string;
    monthYear: string;
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
export type CreditTransactionType = 'scan' | 'streak' | 'milestone' | 'unlock';
export interface CreditTransaction {
    id: string;
    userId: string;
    amount: number;
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
export interface WeeklySpendingByCategory {
    category: string;
    amount: number;
    percentage: number;
}
export interface WeeklyInsights {
    week: string;
    totalSpending: number;
    byCategory: WeeklySpendingByCategory[];
}
export interface MonthlySummary {
    month: string;
    totalSpending: number;
    byCategory: Record<string, number>;
    budgetRemaining?: number;
    treatYourselfSpent?: number;
}
export interface ApiErrorResponse {
    error: string;
    message: string;
    details?: Record<string, string[]>;
}
export interface HealthCheckResponse {
    status: 'ok' | 'error';
    database?: 'connected' | 'disconnected';
    timestamp: string;
}
//# sourceMappingURL=types.d.ts.map