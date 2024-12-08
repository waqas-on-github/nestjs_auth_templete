import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { PrismaService } from 'src/prisma.service';

export class CreateProfileProvider {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createProfileDto: CreateProfileDto) {
    try {
      // check profile already exists
      const profile = await this.prismaService.profile.findFirst({
        where: {
          userId: +createProfileDto.userId,
        },
      });
      if (profile) {
        throw new BadRequestException('Profile already exists');
      }
      // create profile
      const savedProfile = await this.prismaService.profile.create({
        data: {
          userId: +createProfileDto.userId,
          username: createProfileDto.username,
          givenName: createProfileDto.givenName,
          familyName: createProfileDto.familyName,
          picture: createProfileDto.picture,
        },
      });

      if (!savedProfile) {
        throw new InternalServerErrorException('failed to save profile');
      }
      return savedProfile;
    } catch (error) {
      throw error;
    }
  }
}
