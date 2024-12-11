import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { SignUpDto } from '../dto/signUp.dto';
import { CreateProfileProvider } from 'src/profile/providers/create-profile';
import { SendVerificationEmailProvider } from './sendVerificationEmail.provider';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly createProfileProvider: CreateProfileProvider,
    private readonly sendVerificationEmailProvider: SendVerificationEmailProvider,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto, req: Request) {
    try {
      // check user already exists
      const user = await this.prismaService.user.findFirst({
        where: {
          email: signUpDto.email,
        },
      });

      if (user) {
        throw new BadRequestException('User already exists');
      }

      // hash password
      const hashedPassword = await argon2.hash(signUpDto.password);

      // save user to database
      const savedUser = await this.prismaService.user.create({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
        },
      });

      // send user verification email
      await this.sendVerificationEmailProvider.sendUserVerificationEmail(
        savedUser.id,
        req,
        'verify-email',
        this.configService.get<string>('EMAIL_VERIFICATION_TOKEN_SECRET'),
      );

      // genetate user profile automatically
      await this.createProfileProvider.create({
        userId: String(savedUser.id),
        username: savedUser.email.split('@')[0],
      });

      return savedUser;
    } catch (error) {
      throw error;
    }
  }
}
