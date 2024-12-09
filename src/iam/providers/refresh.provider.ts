import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { PrismaService } from 'src/prisma.service';
import { TokenProvider } from './tokenProvider';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshProvider {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly tokenProvider: TokenProvider,
  ) {}
  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      // decode and validate token
      const payload = await this.tokenProvider.validateToken(
        refreshTokenDto.refreshToken,
        this.configService.get<string>('JWT_REFRESH_SECRET'),
      );

      // find user assocated to this token
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('user not found');
      }

      // 3. Check if the refresh token exists in the database with the same userId
      const storedRefreshToken =
        await this.prismaService.refreshToken.findFirst({
          where: {
            userId: user.id,
            refreshToken: refreshTokenDto.refreshToken,
            revoked: false,
          },
        });
      // when user login he'll get refresh token and that refresh token will be saved in database
      //if token is not in database so it means user is not logged in and he may steel refresh token form somewhere else
      if (!storedRefreshToken) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      //if found revoke it
      await this.prismaService.refreshToken.updateMany({
        where: {
          userId: user.id,
          refreshToken: refreshTokenDto.refreshToken,
        },
        data: {
          revoked: true,
        },
      });

      // 4. Generate new access token
      const accessToken = await this.tokenProvider.generateAccessToken(
        user.id,
        user.email,
        user.googleId,
      );
      const refreshToken = await this.tokenProvider.generateRefreshToken(
        user.id,
        user.googleId,
      );
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      // generate new one
    } catch (error) {
      throw error;
    }
  }
}
