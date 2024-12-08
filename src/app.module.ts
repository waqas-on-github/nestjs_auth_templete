import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './iam/guards/jwt.auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { PrismaModule } from './prismaModule/prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), IamModule, PrismaModule, ProfileModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
