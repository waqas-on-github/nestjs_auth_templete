import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDto } from '../dto/signIn.dto';
import * as argon2 from 'argon2';
import { TokenProvider } from './tokenProvider';


@Injectable()
export class SignInProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenProvider: TokenProvider,
  ) {}
  async signIn(signInDto: SignInDto) {
    try {
      // check user exists
      const user = await this.prismaService.user.findFirst({
        where: {
          email: signInDto.email,
        },
      });


      // check user exists
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      // check user email verified or not
      if (!user.emailVerified) {
        throw new BadRequestException('Email not verified');
      }
      // check password
      const validPassword = await argon2.verify(
        user.password,
        signInDto.password,
      );
      if (!validPassword) {
        throw new BadRequestException('Invalid crediantials');
      }

      const [accessToken, refreshToken] =
        await this.tokenProvider.generateTokens(user);

      if (refreshToken) {
        // before saving and sending back to user save refresh token to db revoke previous refresh tokens
        await this.prismaService.refreshToken.updateMany({
          where: {
            userId: user.id,
          },
          data: {
            revoked: true,
          },
        });
        // save refresh token to db
        await this.tokenProvider.saveRefreshToken(refreshToken, user.id);
      }

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
