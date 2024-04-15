import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.SECRET_KEY_JWT })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
