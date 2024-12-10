import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
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
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    PrismaModule,
    ProfileModule,
    ResendModule.forRoot({
      apiKey: 're_a3kguVqX_Bho2AHmydzdbgbYX9k67Ca1o',
    }),
  ],
})
export class IamModule {}
