import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';
import { Public } from '@/common/decorators/public.decorator';
import { PrismaService } from '@/database/prisma.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private redisClient: Redis;

  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const redisUrl = this.configService.get<string>('redis.url') || 'redis://localhost:6379';
    this.redisClient = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
  }

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application, database, and Redis health status' })
  async check() {
    let redisStatus = 'up';
    try {
      if (this.redisClient.status !== 'ready') {
        await this.redisClient.connect();
      }
      await this.redisClient.ping();
    } catch {
      redisStatus = 'down';
    }

    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      async () => ({
        redis: {
          status: redisStatus as 'up' | 'down',
        },
      }),
    ]);
  }
}
