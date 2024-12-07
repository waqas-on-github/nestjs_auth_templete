import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type googleUserProfile = {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
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
          username: profile.name,
          givenName: profile.given_name,
          familyName: profile.family_name,
          picture: profile.picture,
        },
        create: {
          googleId: profile.sub,
          email: profile.email,
          username: profile.name,
          givenName: profile.given_name,
          familyName: profile.family_name,
          picture: profile.picture,
        },
      });

      if (!savedUser) {
        throw new InternalServerErrorException('failed to save user');
      }
      return savedUser;
    } catch (error) {}
  }
}
