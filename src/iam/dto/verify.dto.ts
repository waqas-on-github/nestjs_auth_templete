import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const VerifySchema = z.object({
  token: z.string(),
});

export class VerifyTokenDto extends createZodDto(VerifySchema) {}
