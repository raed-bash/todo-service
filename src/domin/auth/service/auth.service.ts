import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AuthDto } from '../dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bycrpt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: data.username, locked: false },
    });

    if (!user) {
      throw new UnauthorizedException('Error in username');
    }

    if (!(await bycrpt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Error in password');
    }

    const payload = {
      userId: user.id,
      username: user.username,
      roles: [user.role],
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 30,
    });

    const oldToken = await this.prisma.token.findUnique({
      where: { userId: user.id },
    });

    if (oldToken) {
      await this.prisma.token.update({
        where: { userId: user.id },
        data: { token },
      });
    } else {
      await this.prisma.token.create({
        data: { userId: user.id, token },
      });
    }

    return token;
  }
}
