import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleUserProvider } from '../providers/GoogleUserProvider';
import e from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly googleUserProvider: GoogleUserProvider,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3000/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile._json);
    const savedUser = await this.googleUserProvider.saveUserToDb(profile._json);
    done(
      null,
      // data which we want to attach with req.user
      {
        id: savedUser.id,
        email: savedUser.email,
        username: savedUser.username,
        googleId: savedUser.googleId,
      },
    );
  }
}
