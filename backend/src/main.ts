import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;
  const frontendUrl = configService.get<string>('frontendUrl') || 'http://localhost:5173';

  // Security Headers via Helmet
  app.use(helmet());

  // Cookie Parser
  app.use(cookieParser());

  // CORS setup
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        frontendUrl,
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
      ];
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during dev, restrict as needed
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, X-Request-ID',
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('InsightsRank API')
    .setDescription('InsightsRank Modular Monolith Backend Authentication & API Engine')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addCookieAuth('insightsrank_access_token')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Listen on 0.0.0.0 for Render compatibility
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 InsightsRank Backend API running on http://0.0.0.0:${port}/api/v1`);
  logger.log(`📚 Swagger documentation available at http://localhost:${port}/docs`);
}

bootstrap();
