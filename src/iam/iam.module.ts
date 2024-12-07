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

@Module({
  controllers: [IamController],
  providers: [
    IamService,
    ConfigService,
    PrismaService,
    JwtService,
    TokenProvider,
    GoogleUserProvider,
    GoogleStrategy, // Add this line
  ],
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
})
export class IamModule {}
