import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenProvider } from './providers/tokenProvider';

@Injectable()
export class IamService {
  constructor(private readonly toknProvider: TokenProvider) {}
  async SendJwtToken(user: any) {
    const token = await this.toknProvider.generateToken(user);
    console.log('token at iam service', token);

    return token;
  }
}
