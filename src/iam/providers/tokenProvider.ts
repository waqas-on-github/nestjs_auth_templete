import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: any) {
    try {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: this.configService.get<string>('JWT_SECRET'),
      });


      if (!token) {
        throw new UnauthorizedException();
      }

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async validate(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
