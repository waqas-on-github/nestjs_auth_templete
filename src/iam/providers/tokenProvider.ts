import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async signToken(payload: Object, secret: string, expiresIn: string) {
    try {
      const token = await this.jwtService.signAsync(
        {
          ...payload,
        },
        {
          expiresIn: expiresIn,
          secret: secret,
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

  async generateTokens(user) {
    return await Promise.all([
      await this.signToken(
        user,
        this.configService.get<string>('JWT_SECRET'),
        '1h',
      ),
      await this.signToken(
        user,
        this.configService.get<string>('JWT_REFRESH_SECRET'),
        '10d',
      ),
    ]);
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
