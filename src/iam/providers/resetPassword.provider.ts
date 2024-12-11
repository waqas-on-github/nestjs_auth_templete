import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyTokenDto } from '../dto/verify.dto';
import { TokenProvider } from './tokenProvider';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class ResetPasswordProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenProvider: TokenProvider,
    private readonly configService: ConfigService,
  ) {}

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    verifyTokenDto: VerifyTokenDto,
  ) {
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
      // take new password and hash it and save it to db
      const hashedPassword = await argon2.hash(resetPasswordDto.password);

      // if found  let user to reset password process
      const updatedUser = await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      updatedUser.password = undefined;
      return updatedUser;
      // revoke token
    } catch (error) {
      throw error;
    }
  }
}
