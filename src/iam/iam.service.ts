import { Injectable } from '@nestjs/common';
import { TokenProvider } from './providers/tokenProvider';
import { SignUpDto } from './dto/signUp.dto';
import { SignUpProvider } from './providers/signUp.provider';
import { SignInProvider } from './providers/signIn.provider';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshProvider } from './providers/refresh.provider';

@Injectable()
export class IamService {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly signUpProvider: SignUpProvider,
    private readonly signInProvider: SignInProvider,
    private readonly refreshProvider: RefreshProvider,
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
