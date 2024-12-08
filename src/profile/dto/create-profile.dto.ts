import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateProfileSchema = z.object({
  userId: z.string(),
  username: z.string(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  picture: z.string().optional(),
});

// class is required for using DTO as a type
export class CreateProfileDto extends createZodDto(CreateProfileSchema) {}
