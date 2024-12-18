import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type googleUserProfile = {
  sub: string;
  email: string;
};
@Injectable()
export class GoogleUserProvider {
  constructor(private readonly prismaService: PrismaService) {}

  async saveUserToDb(profile: googleUserProfile) {
    try {
      // if user exists, update user
      const savedUser = await this.prismaService.user.upsert({
        where: {
          googleId: profile.sub,
        },
        update: {
          googleId: profile.sub,
          email: profile.email,
        },
        create: {
          googleId: profile.sub,
          email: profile.email,
        },
      });

      if (!savedUser) {
        throw new InternalServerErrorException('failed to save user');
      }
      return savedUser;
    } catch (error) {}
  }
}
