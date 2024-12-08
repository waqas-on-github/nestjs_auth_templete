import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CreateProfileProvider } from './providers/create-profile';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, CreateProfileProvider],
  exports: [CreateProfileProvider],
})
export class ProfileModule {}
