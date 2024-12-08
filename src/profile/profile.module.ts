import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CreateProfileProvider } from './providers/create-profile';
import { UpdateProfileProvider } from './providers/update-profile';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CreateProfileProvider, UpdateProfileProvider],
  exports: [CreateProfileProvider],
})
export class ProfileModule {}
