import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().min(8),
});

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
