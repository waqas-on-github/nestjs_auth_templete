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
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      // check password
      const validPassword = await argon2.verify(
        user.password,
        signInDto.password,
      );
      if (!validPassword) {
        throw new BadRequestException('Invalid password');
      }

      const accessToken = await this.tokenProvider.generateAccessToken(
        user.id,
        user.email,
        user.googleId,
      );
      const refreshToken = await this.tokenProvider.generateRefreshToken(
        user.id,
        user.googleId,
      );

      if (refreshToken) {
        // save refresh token to db
        await this.tokenProvider.saveRefreshToken(refreshToken, user.id);
      }

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
