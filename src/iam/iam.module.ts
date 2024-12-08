import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './stratiges/google.strategy';
import { PrismaService } from 'src/prisma.service';
import { GoogleUserProvider } from './providers/GoogleUserProvider';
import { JwtService } from '@nestjs/jwt';
import { TokenProvider } from './providers/tokenProvider';
import { JwtStrategy } from './stratiges/jwt.stratiegy';
import { SignUpProvider } from './providers/signUp.provider';
import { SignInProvider } from './providers/signIn.provider';

@Module({
  controllers: [IamController],
  providers: [
    IamService,
    ConfigService,
    JwtService,
    TokenProvider,
    GoogleUserProvider,
    GoogleStrategy, // Add this line
    JwtStrategy,
    SignUpProvider,
    SignInProvider,
  ],
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
})
export class IamModule {}
