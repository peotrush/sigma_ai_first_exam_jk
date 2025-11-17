import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    DatabaseModule,
    HealthModule,
    AuthModule,
    // TODO: Import additional modules here
    // - TransactionsModule
    // - InsightsModule
    // - GamificationModule
    // - NotificationsModule
  ],
})
export class AppModule {}
