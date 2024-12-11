import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyTokenDto } from '../dto/verify.dto';
import { TokenProvider } from './tokenProvider';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class ResetPasswordLinkVerifyProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
  ) {}

  async resetPasswordLinkVerify(verifyTokenDto: VerifyTokenDto) {
    try {
      //verify token
      const payload = await this.tokenProvider.validateToken(
        verifyTokenDto.token,
        this.configService.get<string>('PASSWORD_RESET_TOKEN_SECRET'),
      );
      // find user with user id provided in token and email provided in usr body
      const user = await this.prismaService.user.findFirst({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new BadRequestException('user dose not found');
      }

      return verifyTokenDto.token;
      // revoke token
    } catch (error) {
      throw error;
    }
  }
}
