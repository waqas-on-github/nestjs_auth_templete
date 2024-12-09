import { Injectable } from '@nestjs/common';
import { TokenProvider } from './providers/tokenProvider';
import { SignUpDto } from './dto/signUp.dto';
import { SignUpProvider } from './providers/signUp.provider';
import { SignInProvider } from './providers/signIn.provider';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { RefreshProvider } from './providers/refresh.provider';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IamService {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly signUpProvider: SignUpProvider,
    private readonly signInProvider: SignInProvider,
    private readonly refreshProvider: RefreshProvider,
    private readonly prismaService: PrismaService,
  ) {}

  async SignInOauthUser(user: any) {
    const accessToken = await this.tokenProvider.generateAccessToken(
      user.id,
      user.email,
      user.googleId,
    );
    const refreshToken = await this.tokenProvider.generateRefreshToken(
      user.id,
      user.googleId,
    );

    if (refreshToken) {
      // before saving and sending back to user save refresh token to db revoke previous refresh tokens
      await this.prismaService.refreshToken.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          revoked: true,
        },
      });
      // save refresh token to db
      await this.tokenProvider.saveRefreshToken(refreshToken, user.id);
    }

    return { accessToken, refreshToken };
  }

  async SingUp(signUpDto: SignUpDto) {
    return await this.signUpProvider.signUp(signUpDto);
  }

  async SignIn(signInDto: SignUpDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  async Refresh(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshProvider.refresh(refreshTokenDto);
  }
}
