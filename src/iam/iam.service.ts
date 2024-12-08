import { Injectable } from '@nestjs/common';
import { TokenProvider } from './providers/tokenProvider';
import { SignUpDto } from './dto/signUp.dto';
import { SignUpProvider } from './providers/signUp.provider';
import { SignInProvider } from './providers/signIn.provider';

@Injectable()
export class IamService {
  constructor(
    private readonly toknProvider: TokenProvider,
    private readonly signUpProvider: SignUpProvider,
    private readonly signInProvider: SignInProvider,
  ) {}

  async SendJwtToken(user: any) {
    const token = await this.toknProvider.generateToken(user);
    return token;
  }

  async SingUp(signUpDto: SignUpDto) {
    return await this.signUpProvider.signUp(signUpDto);
  }

  async SignIn(signInDto: SignUpDto) {
    return await this.signInProvider.signIn(signInDto);
  }
}
