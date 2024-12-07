import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GoogleUserProvider {
  constructor(private readonly prismaService: PrismaService) {}

  async saveUserToDb(user: Omit<User, 'id'>) {
    try {
      const savedUser = await this.prismaService.user.create({
        data: {
          email: user.email,
          googleId: user.googleId,
          username: user.username,
          givenName: user.givenName,
          familyName: user.familyName,
          picture: user.picture,
        },
      });

      if (!savedUser) {
        throw new InternalServerErrorException('User not saved');
      }
      return savedUser;
    } catch (error) {
      throw error;
    }
  }
}
