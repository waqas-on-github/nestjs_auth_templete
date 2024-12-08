import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// class is required for using DTO as a type
export class SignInDto extends createZodDto(SignInSchema) {}
