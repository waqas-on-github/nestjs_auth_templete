import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  username: z.string(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  picture: z.string().optional(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
