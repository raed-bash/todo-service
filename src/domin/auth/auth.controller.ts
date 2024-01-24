import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './service/auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthResDto } from './dto/auth-res.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiOperation({ summary: 'From Here You Could Signup to System' })
  @ApiResponse({
    type: AuthResDto,
  })
  async login(@Body() body: AuthDto) {
    const token = await this.authService.login(body);
    return token;
  }
}
