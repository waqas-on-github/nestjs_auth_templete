import { Injectable } from '@nestjs/common';
import { TokenProvider } from './providers/tokenProvider';
import { SignUpDto } from './dto/signUp.dto';
import { SignUpProvider } from './providers/signUp.provider';
import { SignInProvider } from './providers/signIn.provider';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshProvider } from './providers/refresh.provider';
import { PrismaService } from 'src/prisma.service';
import { VerifyTokenDto } from './dto/verify.dto';
import { UserVerificationProvider } from './providers/userVerification.provider';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ForgotPasswordProvider } from './providers/forgotPaassword.provider';
import { ResetPasswordLinkVerifyProvider } from './providers/resetPasswordLinkVerify.provider';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordProvider } from './providers/resetPassword.provider';

@Injectable()
export class IamService {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly signUpProvider: SignUpProvider,
    private readonly signInProvider: SignInProvider,
    private readonly refreshProvider: RefreshProvider,
    private readonly prismaService: PrismaService,
    private readonly userVerificationProvider: UserVerificationProvider,
    private readonly resetPasswordLinkVerifyProvider: ResetPasswordLinkVerifyProvider,
    private readonly forgotPasswordProvider: ForgotPasswordProvider,
    private readonly resetPasswordProvider: ResetPasswordProvider,
  ) {}

  async SignInOauthUser(user: any) {
    const [accessToken, refreshToken] =
      await this.tokenProvider.generateTokens(user);

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

  async SingUp(signUpDto: SignUpDto, req: Request) {
    return await this.signUpProvider.signUp(signUpDto, req);
  }

  async SignIn(signInDto: SignUpDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  async Refresh(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshProvider.refresh(refreshTokenDto);
  }
  async verify(verifyTokenDto: VerifyTokenDto) {
    return await this.userVerificationProvider.verify(verifyTokenDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, req: Request) {
    return await this.forgotPasswordProvider.forgotPassword(
      forgotPasswordDto,
      req,
    );
  }

  async resetPasswordLinkVerify(verifyTokenDto: VerifyTokenDto) {
    return await this.resetPasswordLinkVerifyProvider.resetPasswordLinkVerify(
      verifyTokenDto,
    );
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    verifyTokenDto: VerifyTokenDto,
  ) {
    return await this.resetPasswordProvider.resetPassword(
      resetPasswordDto,
      verifyTokenDto,
    );
  }
}
