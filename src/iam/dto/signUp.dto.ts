import { createZodDto } from 'nestjs-zod';

import { SignInSchema } from './signIn.dto';

const SignUpSchema = SignInSchema.extend({});

// class is required for using DTO as a type
export class SignUpDto extends createZodDto(SignUpSchema) {}
