import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new LoggerService();

  // Use custom logger
  app.useLogger(logger);

  // Security: Helmet for HTTP headers
  app.use(helmet());

  // CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:*';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  const apiPrefix = process.env.API_PREFIX || '/api';
  app.setGlobalPrefix(apiPrefix);

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Kash Budget API')
    .setDescription('Mobile-first personal finance application API')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer(
      `http://localhost:${process.env.PORT || 3000}`,
      'Development',
    )
    .addServer('https://api.kash-budget.com', 'Production')
    .addTag('Health', 'System health checks')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Transactions', 'Transaction management')
    .addTag('Insights', 'Analytics and insights')
    .addTag('Gamification', 'Gamification features')
    .addTag('Notifications', 'Push notifications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Start server
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);

  logger.log(
    `🚀 Kash Budget API started on ${host}:${port}`,
    'Bootstrap',
  );
  logger.log(
    `📚 API Documentation available at http://localhost:${port}${apiPrefix}/docs`,
    'Bootstrap',
  );
  logger.log(
    `❤️  Health check available at http://localhost:${port}${apiPrefix}/health`,
    'Bootstrap',
  );
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
