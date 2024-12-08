import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateProfileProvider } from './providers/create-profile';
import { PrismaService } from 'src/prisma.service';
import { UpdateProfileProvider } from './providers/update-profile';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly createProfileProvider: CreateProfileProvider,
    private readonly prismaservice: PrismaService,
    private readonly updateProfileProvider: UpdateProfileProvider,
  ) {}
  async create(createProfileDto: CreateProfileDto) {
    return await this.createProfileProvider.create(createProfileDto);
  }

  async findAll() {
    try {
      const profiles = await this.prismaservice.profile.findMany();
      if (!profiles) {
        throw new InternalServerErrorException('failed to find profiles');
      }
      return profiles;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const profile = await this.prismaservice.profile.findFirst({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new NotFoundException('profile not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async update(updateProfileDto: UpdateProfileDto, id: number) {
    return await this.updateProfileProvider.update(updateProfileDto, id);
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
