import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateProfileProvider } from './providers/create-profile';

@Injectable()
export class ProfileService {
  constructor(private readonly createProfileProvider: CreateProfileProvider) {}
  create(createProfileDto: CreateProfileDto) {
    return this.createProfileProvider.create(createProfileDto);
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
