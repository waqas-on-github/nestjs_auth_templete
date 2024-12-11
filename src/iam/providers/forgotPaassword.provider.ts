import { BadRequestException, Injectable } from '@nestjs/common';
import { ForgotPasswordDto } from '../dto/forgotPassword.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SendVerificationEmailProvider } from './sendVerificationEmail.provider';
import { Request } from 'express';

@Injectable()
export class ForgotPasswordProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly sendVerificationEmailProvider: SendVerificationEmailProvider,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto, req: Request) {
    // verify usery dose is exists
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: forgotPasswordDto.email,
          emailVerified: true, // user must be verified email address to get verification link
        },
      });

      if (!user) {
        throw new BadRequestException('user dose not found ');
      }

      await this.sendVerificationEmailProvider.sendUserVerificationEmail(
        user.id,
        req,
        'reset-password/verify',
        this.configService.get<string>('PASSWORD_RESET_TOKEN_SECRET'),
      );
    } catch (error) {
      throw error;
    }
    // send email to user with link to reset password
  }
}
