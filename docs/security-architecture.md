# Security Architecture

## Overview

This document defines the comprehensive security architecture for the Kash Budget application. Security is a critical foundation for a financial management app handling sensitive user data and transactions.

**Security Principles:**
- Defense in depth (multiple layers of security)
- Least privilege access (minimum necessary permissions)
- Zero trust architecture (verify everything)
- Security by design (not bolted on later)
- GDPR compliance (privacy by default)

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [API Security](#api-security)
3. [Data Security](#data-security)
4. [Mobile App Security](#mobile-app-security)
5. [Infrastructure Security](#infrastructure-security)
6. [GDPR Compliance](#gdpr-compliance)
7. [Secrets Management](#secrets-management)
8. [Security Monitoring](#security-monitoring)
9. [Incident Response](#incident-response)
10. [Deployment Security Checklist](#deployment-security-checklist)

---

## Authentication & Authorization

### OAuth 2.0 Flow

**Grant Type:** Authorization Code with PKCE (Proof Key for Code Exchange)

**Token Types:**
- **Access Token:** Short-lived JWT (15 minutes), used for API requests
- **Refresh Token:** Long-lived (30 days), used to obtain new access tokens

**Authentication Flow:**

```
┌──────────┐                                      ┌──────────┐
│  Mobile  │                                      │   API    │
│   App    │                                      │  Server  │
└────┬─────┘                                      └────┬─────┘
     │                                                 │
     │  1. POST /auth/register                        │
     │    { email, password }                         │
     ├────────────────────────────────────────────────>│
     │                                                 │
     │  2. Create user, hash password                 │
     │     bcrypt(password, 12)                       │
     │                                                 │
     │  3. 201 Created                                │
     │    { accessToken, refreshToken, user }         │
     │<────────────────────────────────────────────────┤
     │                                                 │
     │  4. Store tokens securely                      │
     │     iOS: Keychain                              │
     │     Android: KeyStore                          │
     │                                                 │
     │  5. POST /auth/login                           │
     │    { email, password }                         │
     ├────────────────────────────────────────────────>│
     │                                                 │
     │  6. Verify password                            │
     │     bcrypt.compare(password, hash)             │
     │                                                 │
     │  7. 200 OK                                     │
     │    { accessToken, refreshToken, user }         │
     │<────────────────────────────────────────────────┤
     │                                                 │
     │  8. API Request with expired token             │
     │    Authorization: Bearer <expired_token>       │
     ├────────────────────────────────────────────────>│
     │                                                 │
     │  9. 401 Unauthorized                           │
     │    { error: "token_expired" }                  │
     │<────────────────────────────────────────────────┤
     │                                                 │
     │  10. POST /auth/refresh                        │
     │     { refreshToken }                           │
     ├────────────────────────────────────────────────>│
     │                                                 │
     │  11. Verify refresh token                      │
     │      Check expiry, revocation status           │
     │                                                 │
     │  12. 200 OK                                    │
     │     { accessToken, refreshToken }              │
     │<────────────────────────────────────────────────┤
     │                                                 │
```

### JWT Token Structure

**Access Token Payload:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "type": "access",
  "iat": 1700000000,
  "exp": 1700000900
}
```

**Refresh Token Payload:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "type": "refresh",
  "jti": "unique-token-id",
  "iat": 1700000000,
  "exp": 1702592000
}
```

### Implementation (NestJS)

```typescript
// auth.service.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '30d';

  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(email: string, password: string) {
    // Validate password strength
    this.validatePasswordStrength(password);

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    // Create user
    const user = await this.userRepository.create({ email, passwordHash });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, email);

    return {
      user: { id: user.id, email: user.email },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, email);

    return {
      user: { id: user.id, email: user.email },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Check if token is revoked
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, revokedAt: null },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(payload.sub, payload.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, type: 'access' },
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, type: 'refresh' },
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // Store refresh token in database
    await this.refreshTokenRepository.save({
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }

  private validatePasswordStrength(password: string): void {
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new UnauthorizedException(
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      );
    }
  }
}
```

### Secure Token Storage (Mobile)

**iOS - Keychain:**
```typescript
// secureStorage.ios.ts
import * as Keychain from 'react-native-keychain';

export const SecureStorage = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await Keychain.setGenericPassword('auth', JSON.stringify({
      accessToken,
      refreshToken,
    }), {
      service: 'com.kashbudget.auth',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  async getTokens() {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.kashbudget.auth',
    });

    if (credentials) {
      return JSON.parse(credentials.password);
    }
    return null;
  },

  async clearTokens() {
    await Keychain.resetGenericPassword({
      service: 'com.kashbudget.auth',
    });
  },
};
```

**Android - KeyStore:**
```typescript
// secureStorage.android.ts
import EncryptedStorage from 'react-native-encrypted-storage';

export const SecureStorage = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await EncryptedStorage.setItem('auth_tokens', JSON.stringify({
      accessToken,
      refreshToken,
    }));
  },

  async getTokens() {
    const tokensJson = await EncryptedStorage.getItem('auth_tokens');
    return tokensJson ? JSON.parse(tokensJson) : null;
  },

  async clearTokens() {
    await EncryptedStorage.removeItem('auth_tokens');
  },
};
```

---

## API Security

### Rate Limiting

**Strategy:** Token bucket algorithm with Redis backend

**Limits:**
- **Global:** 1000 requests per 15 minutes per IP
- **Per User:** 100 requests per minute per user
- **Authentication:** 5 failed login attempts per 15 minutes per IP
- **Sensitive Endpoints:** 10 requests per minute (budget updates, profile changes)

**Implementation:**

```typescript
// rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const ip = request.ip;

    // Rate limit key
    const key = userId ? `ratelimit:user:${userId}` : `ratelimit:ip:${ip}`;
    const limit = 100; // requests per minute
    const window = 60; // seconds

    // Get current count
    const current = await this.redis.incr(key);

    // Set expiry on first request
    if (current === 1) {
      await this.redis.expire(key, window);
    }

    // Check limit
    if (current > limit) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }

    // Add headers
    const remaining = Math.max(0, limit - current);
    request.res.setHeader('X-RateLimit-Limit', limit);
    request.res.setHeader('X-RateLimit-Remaining', remaining);
    request.res.setHeader('X-RateLimit-Reset', Date.now() + window * 1000);

    return true;
  }
}
```

### Input Validation

**Strategy:** Class-validator with DTO validation

```typescript
// create-transaction.dto.ts
import { IsNumber, IsOptional, IsEnum, IsString, Min, Max } from 'class-validator';
import { TransactionSource } from '@kash/shared';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  @Max(999999.99)
  amount: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsEnum(['qr_scan', 'manual'])
  source: TransactionSource;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}

export class LocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
```

### CORS Configuration

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS - Allow mobile app origins
  app.enableCors({
    origin: [
      'http://localhost:8081', // React Native dev
      'https://app.kashbudget.com', // Production mobile app
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  await app.listen(3000);
}
bootstrap();
```

### Request Sanitization

```typescript
// sanitization.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/core';
import { Observable } from 'rxjs';
import * as DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class SanitizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitize request body
    if (request.body) {
      request.body = this.sanitizeObject(request.body);
    }

    return next.handle();
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }
}
```

---

## Data Security

### Encryption at Rest

**Database Encryption:**
- AWS RDS encryption enabled (AES-256)
- Encrypted EBS volumes for database storage
- Encrypted automated backups

**Sensitive Data Encryption:**
```typescript
// encryption.service.ts
import * as crypto from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    // Load from AWS KMS or environment variable
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(ciphertext: string): string {
    const [ivHex, authTagHex, encrypted] = ciphertext.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

### Encryption in Transit

**TLS 1.3 Configuration:**

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.kashbudget.com;

    # TLS Configuration
    ssl_certificate /etc/letsencrypt/live/api.kashbudget.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.kashbudget.com/privkey.pem;
    ssl_protocols TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Password Security

**Hashing Strategy:**
- Algorithm: bcrypt
- Cost factor: 12 (MVP), increase to 14 in production
- Automatic rehashing on login if cost factor changes

```typescript
// password.service.ts
import * as bcrypt from 'bcrypt';

export class PasswordService {
  private readonly CURRENT_COST_FACTOR = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.CURRENT_COST_FACTOR);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hash);

    // Rehash if cost factor has increased
    if (isValid && this.needsRehash(hash)) {
      await this.rehashPassword(password);
    }

    return isValid;
  }

  private needsRehash(hash: string): boolean {
    const rounds = bcrypt.getRounds(hash);
    return rounds < this.CURRENT_COST_FACTOR;
  }

  private async rehashPassword(password: string): Promise<void> {
    // Implementation to update user password hash
  }
}
```

---

## Mobile App Security

### Code Obfuscation

**React Native Configuration:**

```javascript
// android/app/proguard-rules.pro
-keep class com.kashbudget.** { *; }
-keepclassmembers class * {
  @android.webkit.JavascriptInterface <methods>;
}

# Obfuscate all other classes
-repackageclasses ''
-allowaccessmodification
```

### Root/Jailbreak Detection

```typescript
// security.service.ts
import JailMonkey from 'jail-monkey';
import { Alert } from 'react-native';

export class SecurityService {
  static checkDeviceSecurity() {
    if (JailMonkey.isJailBroken()) {
      Alert.alert(
        'Security Warning',
        'This device appears to be rooted/jailbroken. For your security, we cannot guarantee the safety of your financial data.',
        [
          { text: 'I Understand', style: 'destructive' },
        ]
      );
      return false;
    }
    return true;
  }

  static async checkSSLPinning() {
    // Implement certificate pinning
    // Prevents man-in-the-middle attacks
  }
}
```

### Certificate Pinning

```typescript
// api.config.ts
import axios from 'axios';

const API_CERT_FINGERPRINTS = [
  'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
];

export const apiClient = axios.create({
  baseURL: 'https://api.kashbudget.com',
  timeout: 10000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
    checkServerIdentity: (host, cert) => {
      // Verify certificate fingerprint
      const fingerprint = calculateFingerprint(cert);
      if (!API_CERT_FINGERPRINTS.includes(fingerprint)) {
        throw new Error('Certificate pinning validation failed');
      }
    },
  }),
});
```

---

## Infrastructure Security

### AWS Security Groups

```yaml
# security-groups.yml
APISecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: API Server Security Group
    VpcId: !Ref VPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 443
        ToPort: 443
        SourceSecurityGroupId: !Ref ALBSecurityGroup
    SecurityGroupEgress:
      - IpProtocol: tcp
        FromPort: 5432
        ToPort: 5432
        DestinationSecurityGroupId: !Ref DatabaseSecurityGroup

DatabaseSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Database Security Group
    VpcId: !Ref VPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 5432
        ToPort: 5432
        SourceSecurityGroupId: !Ref APISecurityGroup
```

### IAM Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::kash-budget-receipts/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:Encrypt"
      ],
      "Resource": "arn:aws:kms:eu-central-1:ACCOUNT_ID:key/KEY_ID"
    }
  ]
}
```

---

## GDPR Compliance

### Data Subject Rights

**1. Right to Access (Article 15)**

```typescript
// gdpr.controller.ts
@Get('gdpr/data-export')
@UseGuards(JwtAuthGuard)
async exportUserData(@CurrentUser() user: User) {
  const userData = {
    profile: await this.userService.getProfile(user.id),
    transactions: await this.transactionService.getUserTransactions(user.id),
    budgetGoals: await this.budgetService.getUserBudgets(user.id),
    locations: await this.locationService.getTaggedLocations(user.id),
    credits: await this.creditService.getCreditHistory(user.id),
  };

  // Generate downloadable JSON file
  return {
    data: userData,
    exportedAt: new Date().toISOString(),
    format: 'JSON',
  };
}
```

**2. Right to Erasure (Article 17)**

```typescript
@Delete('gdpr/delete-account')
@UseGuards(JwtAuthGuard)
async deleteUserAccount(@CurrentUser() user: User) {
  // Anonymize transactions (keep for financial records)
  await this.transactionService.anonymizeUserTransactions(user.id);

  // Delete personal data
  await this.userService.deleteUser(user.id);

  // Delete from all related tables (CASCADE)
  // - tagged_locations
  // - budget_goals
  // - credit_transactions
  // - kash_messages
  // - refresh_tokens

  // Log deletion for compliance
  await this.auditService.logDataDeletion(user.id);

  return { message: 'Account successfully deleted' };
}
```

**3. Right to Data Portability (Article 20)**

```typescript
@Get('gdpr/data-export/csv')
@UseGuards(JwtAuthGuard)
async exportUserDataCSV(@CurrentUser() user: User) {
  const transactions = await this.transactionService.getUserTransactions(user.id);

  // Convert to CSV format
  const csv = this.csvService.generateTransactionCSV(transactions);

  return {
    filename: `kash-transactions-${user.id}.csv`,
    content: csv,
    mimeType: 'text/csv',
  };
}
```

### Privacy Policy Requirements

**Required Disclosures:**
- What data is collected (email, transactions, location)
- Why data is collected (app functionality)
- How data is used (budget tracking, insights)
- Data retention period (indefinite for financial records)
- User rights (access, deletion, portability)
- Contact information for privacy inquiries

### Consent Management

```typescript
// consent.service.ts
export class ConsentService {
  async recordConsent(userId: string, consentType: string) {
    await this.consentRepository.save({
      userId,
      consentType, // 'terms_of_service', 'privacy_policy', 'location_tracking'
      grantedAt: new Date(),
      version: '1.0',
    });
  }

  async checkConsent(userId: string, consentType: string): Promise<boolean> {
    const consent = await this.consentRepository.findOne({
      where: { userId, consentType },
    });
    return !!consent;
  }
}
```

---

## Secrets Management

### Environment Variables (Development)

```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=kash_budget
DATABASE_USER=kash_app
DATABASE_PASSWORD=changeme

# JWT
JWT_SECRET=your-secret-key-here-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Encryption
ENCRYPTION_KEY=64-character-hex-key-here

# AWS (for production)
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### AWS Secrets Manager (Production)

```typescript
// secrets.service.ts
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export class SecretsService {
  private client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient({ region: 'eu-central-1' });
  }

  async getSecret(secretName: string): Promise<any> {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await this.client.send(command);
    return JSON.parse(response.SecretString);
  }

  async loadDatabaseCredentials() {
    const secrets = await this.getSecret('kash-budget/database');
    return {
      host: secrets.host,
      port: secrets.port,
      username: secrets.username,
      password: secrets.password,
      database: secrets.database,
    };
  }
}
```

### Secret Rotation

```typescript
// Automatic secret rotation (30 days)
// AWS Lambda function triggered by AWS Secrets Manager

export const handler = async (event: any) => {
  const secretId = event.SecretId;
  const token = event.Token;
  const step = event.Step;

  switch (step) {
    case 'createSecret':
      // Generate new password
      const newPassword = generateSecurePassword();
      await secretsManager.putSecretValue({
        SecretId: secretId,
        ClientRequestToken: token,
        SecretString: JSON.stringify({ password: newPassword }),
        VersionStages: ['AWSPENDING'],
      });
      break;

    case 'setSecret':
      // Update database password
      await updateDatabasePassword(secretId, token);
      break;

    case 'testSecret':
      // Test new password
      await testDatabaseConnection(secretId, token);
      break;

    case 'finishSecret':
      // Mark new version as current
      await secretsManager.updateSecretVersionStage({
        SecretId: secretId,
        VersionStage: 'AWSCURRENT',
        MoveToVersionId: token,
        RemoveFromVersionId: 'AWSPENDING',
      });
      break;
  }
};
```

---

## Security Monitoring

### Logging Strategy

```typescript
// logger.service.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'kash-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Security event logging
export function logSecurityEvent(event: string, details: any) {
  logger.warn('SECURITY_EVENT', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
}
```

### Intrusion Detection

```typescript
// security-monitor.service.ts
export class SecurityMonitor {
  async detectSuspiciousActivity(userId: string) {
    // Check for rapid API calls
    const requestCount = await this.redis.get(`requests:${userId}`);
    if (Number(requestCount) > 1000) {
      await this.alertSecurityTeam('Abnormal API usage', { userId });
    }

    // Check for multiple failed login attempts
    const failedLogins = await this.redis.get(`failed_logins:${userId}`);
    if (Number(failedLogins) > 5) {
      await this.lockAccount(userId, '15 minutes');
    }

    // Check for access from unusual locations
    const currentIp = await this.getRequestIp();
    const previousIps = await this.getUserIpHistory(userId);
    if (!previousIps.includes(currentIp)) {
      await this.sendSecurityAlert(userId, 'New login location detected');
    }
  }
}
```

---

## Incident Response

### Incident Response Plan

**1. Detection & Analysis**
- Monitor Sentry for errors
- Monitor CloudWatch for anomalies
- Review failed authentication attempts
- Check rate limiting violations

**2. Containment**
- Revoke compromised tokens
- Block suspicious IP addresses
- Disable affected user accounts
- Isolate affected services

**3. Eradication**
- Patch vulnerabilities
- Reset compromised credentials
- Update firewall rules
- Deploy security fixes

**4. Recovery**
- Restore from backups if necessary
- Re-enable services gradually
- Monitor for continued attack

**5. Post-Incident**
- Document incident timeline
- Update security policies
- Conduct team retrospective
- Notify affected users (GDPR requirement)

### Security Breach Notification

```typescript
// breach-notification.service.ts
export class BreachNotificationService {
  async notifyUsersOfBreach(affectedUserIds: string[], breachDetails: string) {
    for (const userId of affectedUserIds) {
      await this.emailService.send({
        to: await this.getUserEmail(userId),
        subject: 'Important Security Notice - Kash Budget',
        template: 'security-breach',
        data: {
          breachDate: new Date(),
          breachDetails,
          actionRequired: 'Please reset your password immediately',
        },
      });
    }

    // GDPR requirement: notify authorities within 72 hours
    await this.notifyDataProtectionAuthority(breachDetails);
  }
}
```

---

## Deployment Security Checklist

### Pre-Deployment

- [ ] All dependencies updated and audited (`npm audit`)
- [ ] No secrets in source code or environment files
- [ ] All API endpoints have authentication guards
- [ ] Rate limiting enabled on all endpoints
- [ ] Input validation on all user inputs
- [ ] CORS configured for production domains only
- [ ] Security headers configured (Helmet.js)
- [ ] Database migrations tested
- [ ] SSL certificates valid and renewed
- [ ] Backup strategy tested

### Post-Deployment

- [ ] Monitor error logs for 24 hours
- [ ] Verify SSL/TLS certificate
- [ ] Test authentication flow end-to-end
- [ ] Verify rate limiting works
- [ ] Check security headers (securityheaders.com)
- [ ] Run penetration testing (OWASP ZAP)
- [ ] Verify backup restoration
- [ ] Monitor performance metrics

### Security Audit (Quarterly)

- [ ] Dependency vulnerability scan
- [ ] Code security review
- [ ] Database access audit
- [ ] AWS IAM policy review
- [ ] Third-party integration review
- [ ] Incident response drill
- [ ] GDPR compliance review
- [ ] Password policy review

---

## Security Testing

### Automated Security Scans

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'kash-budget'
          path: '.'
          format: 'HTML'
```

### Penetration Testing

**Tools:**
- OWASP ZAP (automated scanning)
- Burp Suite (manual testing)
- Metasploit (exploitation testing)

**Test Cases:**
- SQL injection attempts
- XSS attacks
- CSRF attacks
- Authentication bypass
- Session hijacking
- API rate limit bypass

---

## Version History

| Version | Date       | Author | Changes                             |
|---------|------------|--------|-------------------------------------|
| 1.0     | 2025-11-17 | Team   | Initial security architecture       |

---

*Last Updated: 2025-11-17*
