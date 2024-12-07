import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './stratiges/google.strategy';

@Module({
  controllers: [IamController],
  providers: [
    IamService,
    ConfigService,
    GoogleStrategy, // Add this line
  ],
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
})
export class IamModule {}
