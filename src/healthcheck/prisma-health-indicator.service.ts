import { Injectable } from '@nestjs/common';
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
    constructor(private readonly prismaService: PrismaService) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            await this.prismaService.$queryRaw`SELECT 1`.catch((e) => {
                throw new HealthCheckError('Prisma database check failed', e);
            });
            return this.getStatus(key, true);
        } catch (e) {
            throw new HealthCheckError('Prisma database check failed', e);
        }
    }
}
