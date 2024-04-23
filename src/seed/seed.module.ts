import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { UserService } from 'src/domain/user/service/user.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService, UserService],
})
export class SeedModule {}
