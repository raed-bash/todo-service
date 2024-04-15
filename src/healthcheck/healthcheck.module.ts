import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthcheckController } from './healthcheck.controller';
import { PrismaHealthIndicator } from './prisma-health-indicator.service';

@Module({
    imports: [TerminusModule],
    controllers: [HealthcheckController],
    providers: [PrismaHealthIndicator],
})
export class HealthcheckModule {}
