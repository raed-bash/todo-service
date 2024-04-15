import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health-indicator.service';
import { ApiTags } from '@nestjs/swagger';
import { NoAuthRequired } from 'src/common/guards/auth-required.decorator';

@Controller('healthcheck')
@ApiTags('System Health Check')
@NoAuthRequired()
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([() => this.prismaHealth.isHealthy('database')]);
  }
}
