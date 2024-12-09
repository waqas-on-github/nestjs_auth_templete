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
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    PrismaModule,
    ProfileModule,
  ],
})
export class IamModule {}
