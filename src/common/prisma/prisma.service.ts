import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { isEnvDev } from '../utils/envinroment.utils';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'info' | 'warn' | 'error' | 'query'
  >
  implements OnModuleInit
{
  constructor() {
    super({
      log: isEnvDev()
        ? [
            {
              emit: 'event',
              level: 'query',
            },
            {
              emit: 'stdout',
              level: 'error',
            },
            {
              emit: 'stdout',
              level: 'info',
            },
            {
              emit: 'stdout',
              level: 'warn',
            },
          ]
        : [],
    });
  }
  async onModuleInit() {
    await this.$connect();
    this.$on('query', (e) => {
      console.log(`query ${e.query}`);
      console.log(`params ${e.params}`);
      console.log(`duration ${e.duration} ms`);
    });
  }
}
