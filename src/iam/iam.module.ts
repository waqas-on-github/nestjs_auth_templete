import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './stratiges/google.strategy';
import { GoogleUserProvider } from './providers/GoogleUserProvider';
import { JwtService } from '@nestjs/jwt';
import { TokenProvider } from './providers/tokenProvider';
import { JwtStrategy } from './stratiges/jwt.stratiegy';
import { SignUpProvider } from './providers/signUp.provider';
import { SignInProvider } from './providers/signIn.provider';
import { PrismaModule } from 'src/prismaModule/prisma.module';
import { ProfileModule } from 'src/profile/profile.module';
import { RefreshProvider } from './providers/refresh.provider';
import { ResendModule } from 'nestjs-resend';
import { NotificationProvider } from './providers/notification.provider';
import { UserVerificationProvider } from './providers/userVerification.provider';
import { SendVerificationEmailProvider } from './providers/sendVerificationEmail.provider';

import { IamController } from './iam.controller';
import { ForgotPasswordProvider } from './providers/forgotPaassword.provider';
import { ResetPasswordLinkVerifyProvider } from './providers/resetPasswordLinkVerify.provider';
import { ResetPasswordProvider } from './providers/resetPassword.provider';

@Module({
  controllers: [IamController],
  providers: [
    IamService,
    ConfigService,
    JwtService,
    TokenProvider,
    GoogleUserProvider,
    GoogleStrategy,
    JwtStrategy,
    SignUpProvider,
    SignInProvider,
    RefreshProvider,
    NotificationProvider,
    UserVerificationProvider,
    SendVerificationEmailProvider,
    ResetPasswordLinkVerifyProvider,
    ForgotPasswordProvider,
    ResetPasswordProvider,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    PrismaModule,
    ProfileModule,
    ResendModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('RESEND_API_KEY'),
      }),
    }),
  ],
})
export class IamModule {}
