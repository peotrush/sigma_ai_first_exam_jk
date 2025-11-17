# Database Schema

## Overview

This document defines the complete database schema for the Kash Budget application. The database uses **PostgreSQL 14+** for ACID compliance, JSON support, and reliability with financial data.

**Key Design Principles:**
- Strong referential integrity with foreign key constraints
- Optimized indexes for common query patterns
- Timestamp tracking for audit trails
- UUID primary keys for distributed systems support
- JSON columns for flexible metadata storage

---

## Entity-Relationship Diagram

```
┌─────────────────┐
│      User       │
│─────────────────│
│ id (PK)         │─┐
│ email           │ │
│ password_hash   │ │
│ created_at      │ │
│ updated_at      │ │
└─────────────────┘ │
                    │
    ┌───────────────┼───────────────┬───────────────┬───────────────┬───────────────┐
    │               │               │               │               │               │
    │               │               │               │               │               │
    ▼               ▼               ▼               ▼               ▼               ▼
┌─────────────┐ ┌────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Transaction │ │   Tagged   │ │ BudgetGoal   │ │   Credit     │ │    Kash      │ │RefreshToken  │
│             │ │  Location  │ │              │ │ Transaction  │ │   Message    │ │              │
│─────────────│ │────────────│ │──────────────│ │──────────────│ │──────────────│ │──────────────│
│ id (PK)     │ │ id (PK)    │ │ id (PK)      │ │ id (PK)      │ │ id (PK)      │ │ id (PK)      │
│ user_id(FK) │ │ user_id(FK)│ │ user_id (FK) │ │ user_id (FK) │ │ user_id (FK) │ │ user_id (FK) │
│ amount      │ │ name       │ │ month_year   │ │ amount       │ │ message_text │ │ token        │
│ timestamp   │ │ latitude   │ │ total_budget │ │ reason       │ │ pose         │ │ expires_at   │
│ category_id │ │ longitude  │ │ created_at   │ │ tx_type      │ │ trigger_event│ │ created_at   │
│ location    │ │ created_at │ │ updated_at   │ │ created_at   │ │ read_at      │ │ revoked_at   │
│ source      │ └────────────┘ └──────────────┘ └──────────────┘ │ created_at   │ └──────────────┘
│ notes       │                       │                            └──────────────┘
│ created_at  │                       │
│ updated_at  │                       │
└─────────────┘                       │
      │                               │
      └──────────────┐                │
                     ▼                ▼
              ┌─────────────┐  ┌─────────────────────┐
              │  Category   │  │ CategoryBudgetLimit │
              │─────────────│  │─────────────────────│
              │ id (PK)     │◄─┤ id (PK)             │
              │ name        │  │ budget_goal_id (FK) │
              │ icon        │  │ category_id (FK)    │
              │ color       │  │ limit_amount        │
              │ is_default  │  └─────────────────────┘
              │ display_ord │
              │ user_id (FK)│
              │ created_at  │
              └─────────────┘
```

---

## Table Definitions

### 1. users

Stores user account information and authentication credentials.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);

-- Constraints
ALTER TABLE users ADD CONSTRAINT chk_email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Fields:**
- `id` (UUID): Primary key, auto-generated
- `email` (VARCHAR): Unique email address, indexed for fast lookups
- `password_hash` (VARCHAR): Bcrypt hashed password (cost factor 12)
- `created_at` (TIMESTAMP): Account creation timestamp
- `updated_at` (TIMESTAMP): Last profile update timestamp

---

### 2. categories

Predefined and custom spending categories.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_categories_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_color_format CHECK (color ~* '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT chk_default_no_user CHECK (
    (is_default = true AND user_id IS NULL) OR
    (is_default = false AND user_id IS NOT NULL) OR
    (is_default = false AND user_id IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Unique constraint: category name must be unique per user (or globally for defaults)
CREATE UNIQUE INDEX idx_categories_unique_name
  ON categories(COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID), name);
```

**Fields:**
- `id` (UUID): Primary key
- `name` (VARCHAR): Category name (e.g., "Groceries", "Dining")
- `icon` (VARCHAR): Icon identifier (e.g., "shopping-cart", "utensils")
- `color` (VARCHAR): Hex color code for UI visualization
- `is_default` (BOOLEAN): True for system-provided categories
- `display_order` (INTEGER): Determines sorting order in UI
- `user_id` (UUID): NULL for default categories, user ID for custom categories
- `created_at` (TIMESTAMP): Creation timestamp

**Default Categories Seed Data:**
```sql
INSERT INTO categories (name, icon, color, is_default, display_order) VALUES
  ('Groceries', 'shopping-cart', '#4CAF50', true, 1),
  ('Dining', 'utensils', '#FF9800', true, 2),
  ('Transport', 'car', '#2196F3', true, 3),
  ('Entertainment', 'film', '#9C27B0', true, 4),
  ('Shopping', 'shopping-bag', '#E91E63', true, 5),
  ('Bills', 'file-text', '#607D8B', true, 6),
  ('Health', 'heart', '#F44336', true, 7),
  ('Treat Yourself', 'gift', '#FFC107', true, 8);
```

---

### 3. transactions

Core table for storing all spending transactions.

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  category_id UUID,
  location JSONB,
  source VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_transactions_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_category FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT chk_amount_positive CHECK (amount > 0),
  CONSTRAINT chk_source_valid CHECK (source IN ('qr_scan', 'manual'))
);

-- Indexes for common queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_timestamp ON transactions(user_id, timestamp DESC);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- GIN index for JSONB location queries
CREATE INDEX idx_transactions_location ON transactions USING GIN (location);

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Fields:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users table
- `amount` (DECIMAL): Transaction amount in local currency (2 decimal precision)
- `timestamp` (TIMESTAMP): When the transaction occurred (from receipt or user input)
- `category_id` (UUID): Foreign key to categories table (nullable for uncategorized)
- `location` (JSONB): GPS coordinates and optional name: `{"latitude": 42.6977, "longitude": 23.3219, "name": "Billa Store"}`
- `source` (VARCHAR): Transaction entry method: `qr_scan` or `manual`
- `notes` (TEXT): Optional user notes
- `created_at` (TIMESTAMP): Database record creation time
- `updated_at` (TIMESTAMP): Last modification time

**Location JSONB Structure:**
```json
{
  "latitude": 42.6977082,
  "longitude": 23.3218675,
  "name": "Billa - Sofia Center"
}
```

---

### 4. tagged_locations

User-defined frequently visited locations for geofencing and filtering.

```sql
CREATE TABLE tagged_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(11, 7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_tagged_locations_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT chk_longitude_range CHECK (longitude >= -180 AND longitude <= 180)
);

-- Indexes
CREATE INDEX idx_tagged_locations_user_id ON tagged_locations(user_id);

-- Spatial index for proximity queries (requires PostGIS extension)
-- If PostGIS is available:
-- CREATE INDEX idx_tagged_locations_geom ON tagged_locations
--   USING GIST (ST_MakePoint(longitude, latitude));
```

**Fields:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users table
- `name` (VARCHAR): User-defined location name (e.g., "My Local Lidl")
- `latitude` (DECIMAL): GPS latitude coordinate (7 decimal places for ~1cm precision)
- `longitude` (DECIMAL): GPS longitude coordinate (7 decimal places)
- `created_at` (TIMESTAMP): Creation timestamp

---

### 5. budget_goals

Monthly budget goal tracking.

```sql
CREATE TABLE budget_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  month_year VARCHAR(7) NOT NULL,
  total_budget DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_budget_goals_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_total_budget_positive CHECK (total_budget > 0),
  CONSTRAINT chk_month_year_format CHECK (month_year ~* '^\d{4}-\d{2}$'),
  CONSTRAINT uniq_user_month_year UNIQUE (user_id, month_year)
);

-- Indexes
CREATE INDEX idx_budget_goals_user_id ON budget_goals(user_id);
CREATE INDEX idx_budget_goals_month_year ON budget_goals(month_year);

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_budget_goals_updated_at
  BEFORE UPDATE ON budget_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Fields:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users table
- `month_year` (VARCHAR): Month identifier in format "YYYY-MM" (e.g., "2025-11")
- `total_budget` (DECIMAL): Total monthly budget amount
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last modification time

---

### 6. category_budget_limits

Optional per-category budget limits within a monthly budget.

```sql
CREATE TABLE category_budget_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_goal_id UUID NOT NULL,
  category_id UUID NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL,

  CONSTRAINT fk_category_limits_budget FOREIGN KEY (budget_goal_id)
    REFERENCES budget_goals(id) ON DELETE CASCADE,
  CONSTRAINT fk_category_limits_category FOREIGN KEY (category_id)
    REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT chk_limit_amount_positive CHECK (limit_amount > 0),
  CONSTRAINT uniq_budget_category UNIQUE (budget_goal_id, category_id)
);

-- Indexes
CREATE INDEX idx_category_limits_budget_id ON category_budget_limits(budget_goal_id);
CREATE INDEX idx_category_limits_category_id ON category_budget_limits(category_id);
```

**Fields:**
- `id` (UUID): Primary key
- `budget_goal_id` (UUID): Foreign key to budget_goals table
- `category_id` (UUID): Foreign key to categories table
- `limit_amount` (DECIMAL): Budget limit for this specific category

---

### 7. credit_transactions

Gamification credit system tracking.

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_credit_transactions_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_transaction_type_valid CHECK (
    transaction_type IN ('scan', 'streak', 'milestone', 'unlock')
  )
);

-- Indexes
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);
```

**Fields:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users table
- `amount` (INTEGER): Credit amount (positive for earning, negative for spending)
- `reason` (VARCHAR): Human-readable explanation (e.g., "Scanned 5th receipt today")
- `transaction_type` (VARCHAR): Type of credit event: `scan`, `streak`, `milestone`, `unlock`
- `created_at` (TIMESTAMP): Transaction timestamp

**Credit Balance Calculation:**
```sql
-- View for user credit balances
CREATE VIEW user_credits AS
SELECT
  user_id,
  COALESCE(SUM(amount), 0) as balance,
  COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) as total_earned,
  COALESCE(ABS(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END)), 0) as total_spent
FROM credit_transactions
GROUP BY user_id;
```

---

### 8. kash_messages

Mascot messages and notifications.

```sql
CREATE TABLE kash_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  message_text TEXT NOT NULL,
  pose VARCHAR(20) NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_kash_messages_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_pose_valid CHECK (
    pose IN ('greeting', 'celebration', 'thinking', 'encouraging', 'warning')
  )
);

-- Indexes
CREATE INDEX idx_kash_messages_user_id ON kash_messages(user_id);
CREATE INDEX idx_kash_messages_read_at ON kash_messages(user_id, read_at);
CREATE INDEX idx_kash_messages_created_at ON kash_messages(created_at DESC);
```

**Fields:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users table
- `message_text` (TEXT): Message content from Kash mascot
- `pose` (VARCHAR): Mascot pose/emotion: `greeting`, `celebration`, `thinking`, `encouraging`, `warning`
- `trigger_event` (VARCHAR): Event that triggered the message (e.g., "first_scan", "budget_warning")
- `read_at` (TIMESTAMP): When user acknowledged the message (NULL if unread)
- `created_at` (TIMESTAMP): Message creation time

---

### 9. refresh_tokens

OAuth 2.0 refresh token storage for secure authentication.

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Cleanup expired tokens periodically
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
```

**Fields:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users table
- `token` (VARCHAR): Hashed refresh token value (unique)
- `expires_at` (TIMESTAMP): Token expiration timestamp
- `created_at` (TIMESTAMP): Token creation time
- `revoked_at` (TIMESTAMP): When token was manually revoked (NULL if still valid)

---

## Common Query Patterns

### 1. Get User Transactions for Current Month

```sql
SELECT
  t.id,
  t.amount,
  t.timestamp,
  c.name as category_name,
  c.color as category_color,
  t.location,
  t.source,
  t.notes
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
  AND t.timestamp >= date_trunc('month', CURRENT_DATE)
  AND t.timestamp < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY t.timestamp DESC;
```

### 2. Calculate Spending by Category for Month

```sql
SELECT
  c.name,
  c.color,
  c.icon,
  COALESCE(SUM(t.amount), 0) as total_spent
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
  AND t.user_id = $1
  AND t.timestamp >= date_trunc('month', CURRENT_DATE)
  AND t.timestamp < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
WHERE c.is_default = true OR c.user_id = $1
GROUP BY c.id, c.name, c.color, c.icon, c.display_order
ORDER BY c.display_order;
```

### 3. Get Budget Progress for Current Month

```sql
SELECT
  bg.total_budget,
  COALESCE(SUM(t.amount), 0) as total_spent,
  bg.total_budget - COALESCE(SUM(t.amount), 0) as remaining
FROM budget_goals bg
LEFT JOIN transactions t ON t.user_id = bg.user_id
  AND t.timestamp >= (bg.month_year || '-01')::DATE
  AND t.timestamp < (bg.month_year || '-01')::DATE + INTERVAL '1 month'
WHERE bg.user_id = $1
  AND bg.month_year = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
GROUP BY bg.id, bg.total_budget;
```

### 4. Find Transactions Near Tagged Location

```sql
SELECT t.*
FROM transactions t
WHERE t.user_id = $1
  AND t.location IS NOT NULL
  AND (
    (t.location->>'latitude')::DECIMAL BETWEEN $2 - 0.001 AND $2 + 0.001
    AND (t.location->>'longitude')::DECIMAL BETWEEN $3 - 0.001 AND $3 + 0.001
  )
ORDER BY t.timestamp DESC;
```

### 5. Get Unread Kash Messages

```sql
SELECT
  id,
  message_text,
  pose,
  trigger_event,
  created_at
FROM kash_messages
WHERE user_id = $1
  AND read_at IS NULL
ORDER BY created_at ASC
LIMIT 10;
```

---

## Database Migrations Strategy

**Tool:** TypeORM migrations

**Migration Naming Convention:**
```
YYYYMMDDHHMMSS-DescriptiveName.ts
```

**Example Migration:**
```typescript
// 20251117120000-CreateUsersTable.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable20251117120000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
```

**Migration Commands:**
```bash
# Generate migration
npm run migration:generate -- -n CreateUsersTable

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

---

## Data Retention and Cleanup

### Retention Policies

**Active Data:**
- User accounts: Retained until user requests deletion (GDPR compliance)
- Transactions: Retained indefinitely (financial records)
- Messages: 90 days, then archived or deleted

**Expired Data:**
- Refresh tokens: Cleaned up 7 days after expiration
- Read messages: Deleted after 90 days

### Cleanup Jobs

```sql
-- Scheduled cleanup function (run daily via cron or pg_cron)
CREATE OR REPLACE FUNCTION daily_cleanup()
RETURNS void AS $$
BEGIN
  -- Delete expired refresh tokens
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';

  -- Delete old read messages
  DELETE FROM kash_messages
  WHERE read_at IS NOT NULL
    AND read_at < NOW() - INTERVAL '90 days';

  -- Vacuum analyze for performance
  VACUUM ANALYZE;
END;
$$ LANGUAGE plpgsql;
```

---

## Backup and Recovery

**Backup Strategy:**
- Automated daily backups via AWS RDS automated backups
- Retention: 7 days for MVP, 30 days for production
- Point-in-time recovery enabled
- Weekly backup verification tests

**Backup Command (manual):**
```bash
pg_dump -h $DB_HOST -U $DB_USER -d kash_budget -F c -f backup_$(date +%Y%m%d).dump
```

**Restore Command:**
```bash
pg_restore -h $DB_HOST -U $DB_USER -d kash_budget -c backup_20251117.dump
```

---

## Performance Optimization

### Index Strategy

**Primary Indexes:**
- All foreign keys are indexed
- Timestamp fields for date range queries
- Email for authentication lookups
- Composite indexes for common query patterns

**Query Optimization:**
- Use EXPLAIN ANALYZE for slow queries
- Monitor query performance with pg_stat_statements
- Set up connection pooling (max 20 connections for MVP)

**PostgreSQL Configuration (RDS):**
```
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 8MB
maintenance_work_mem = 64MB
max_connections = 100
```

---

## Database Security

### Access Control

**Database User Roles:**
```sql
-- Application user (limited permissions)
CREATE USER kash_app WITH PASSWORD 'secure_password_here';
GRANT CONNECT ON DATABASE kash_budget TO kash_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO kash_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO kash_app;

-- Read-only analytics user
CREATE USER kash_analytics WITH PASSWORD 'analytics_password';
GRANT CONNECT ON DATABASE kash_budget TO kash_analytics;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO kash_analytics;
```

### Encryption

- **At Rest:** AWS RDS encryption enabled (AES-256)
- **In Transit:** SSL/TLS connections required (ssl_mode=require)
- **Sensitive Fields:** Password hashes use bcrypt (cost factor 12)

### Connection String (Production)

```
postgresql://kash_app:PASSWORD@rds-instance.region.rds.amazonaws.com:5432/kash_budget?ssl=true&sslmode=require
```

---

## Testing and Seeding

### Test Database Setup

```bash
# Create test database
createdb kash_budget_test

# Run migrations
NODE_ENV=test npm run migration:run

# Seed test data
NODE_ENV=test npm run seed
```

### Seed Data Script

```typescript
// seeds/default-categories.seed.ts
export const seedDefaultCategories = async () => {
  const categories = [
    { name: 'Groceries', icon: 'shopping-cart', color: '#4CAF50', displayOrder: 1 },
    { name: 'Dining', icon: 'utensils', color: '#FF9800', displayOrder: 2 },
    { name: 'Transport', icon: 'car', color: '#2196F3', displayOrder: 3 },
    { name: 'Entertainment', icon: 'film', color: '#9C27B0', displayOrder: 4 },
    { name: 'Shopping', icon: 'shopping-bag', color: '#E91E63', displayOrder: 5 },
    { name: 'Bills', icon: 'file-text', color: '#607D8B', displayOrder: 6 },
    { name: 'Health', icon: 'heart', color: '#F44336', displayOrder: 7 },
    { name: 'Treat Yourself', icon: 'gift', color: '#FFC107', displayOrder: 8 },
  ];

  await categoryRepository.save(categories.map(cat => ({ ...cat, isDefault: true })));
};
```

---

## Monitoring and Alerting

**Key Metrics to Monitor:**
- Connection pool utilization
- Query execution times (p95, p99)
- Database size growth
- Index hit ratio (should be >99%)
- Dead tuples count
- Replication lag (if using read replicas)

**Alert Thresholds:**
- Connection pool >80% utilized
- Query time >1 second
- Database size >80% of allocated storage
- Index hit ratio <95%

---

## Future Enhancements

**Phase 2 Considerations:**
1. **Read Replicas:** Add read replica for analytics queries
2. **Partitioning:** Partition transactions table by month for better performance
3. **Full-Text Search:** Add GIN indexes for searching transaction notes
4. **PostGIS:** Enable PostGIS extension for advanced geospatial queries
5. **Materialized Views:** Create materialized views for complex analytics queries

---

## Version History

| Version | Date       | Author | Changes                          |
|---------|------------|--------|----------------------------------|
| 1.0     | 2025-11-17 | Team   | Initial database schema design   |

---

*Last Updated: 2025-11-17*
