import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UpdateProfileProvider {
  constructor(private readonly prismaService: PrismaService) {}
  async update(updateProfileDto: UpdateProfileDto, id: number) {
    try {
      // check profile exists
      const profile = await this.prismaService.profile.findFirst({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new BadRequestException('Profile does not exist');
      }
      // update profile
      const updatedProfile = await this.prismaService.profile.update({
        where: {
          id: id,
        },
        data: {
          username: updateProfileDto.username,
          givenName: updateProfileDto.givenName,
          familyName: updateProfileDto.familyName,
          picture: updateProfileDto.picture,
        },
      });

      if (!updatedProfile) {
        throw new InternalServerErrorException('failed to update profile');
      }
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }
}
