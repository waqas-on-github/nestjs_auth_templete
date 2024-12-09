import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateAccessToken(id: number, email: string, googlId: string) {
    try {
      const token = await this.jwtService.signAsync(
        {
          id: id,
          email: email,
          googlId: googlId,
        },
        {
          expiresIn: '1h',
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      if (!token) {
        throw new InternalServerErrorException(
          'failed to generate access token',
        );
      }

      return token;
    } catch (error) {
      throw error;
    }
  }

  async generateRefreshToken(id: number, googleId: string) {
    try {
      const token = await this.jwtService.signAsync(
        {
          id: id,
          googleId: googleId,
        },
        {
          expiresIn: '10d',
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (!token) {
        throw new InternalServerErrorException(
          'failed to generate refresh token',
        );
      }

      return token;
    } catch (error) {
      throw error;
    }
  }

  async validateToken(token: string, secret: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      return payload;
    } catch (error) {
      throw new InternalServerErrorException({
        name: error.name,
        message: error.message,
      });
    }
  }

  async saveRefreshToken(refreshToken: string, userId: number) {
    try {
      await this.prismaService.refreshToken.create({
        data: {
          refreshToken: refreshToken,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
