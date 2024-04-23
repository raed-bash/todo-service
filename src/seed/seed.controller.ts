import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
import { NoAuthRequired } from 'src/common/guards/auth-required.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('seed')
@NoAuthRequired()
@ApiTags('Seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Put Seed to running system' })
  async seed() {
    await this.seedService.putSeed();
  }
}
