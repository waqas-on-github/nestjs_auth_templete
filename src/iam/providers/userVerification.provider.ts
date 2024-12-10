import { BadRequestException, Injectable } from '@nestjs/common';
import { VerifyDto } from '../dto/verify.dto';
import { TokenProvider } from './tokenProvider';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserVerificationProvider {
  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async verify(verifyDto: VerifyDto) {
    try {
      // verify token
      const payload = await this.tokenProvider.validateToken(
        verifyDto.token,
        this.configService.get<string>('VERIFICATION_TOKEN_SECRET'),
      );

      //check if user exists
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }

      // TODO --> add verification token revokation system

      await this.prismaService.user.update({
        where: {
          id: payload.id,
        },
        data: {
          emailVerified: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
