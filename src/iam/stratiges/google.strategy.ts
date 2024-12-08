import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { GoogleUserProvider } from '../providers/GoogleUserProvider';
import { CreateProfileProvider } from 'src/profile/providers/create-profile';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private readonly googleUserProvider: GoogleUserProvider,
    private readonly createProfileProvider: CreateProfileProvider,
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
    refreshToken: string, // TODO! save access token and refresh token in redis
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile._json);
    // save user to database
    const savedUser = await this.googleUserProvider.saveUserToDb(profile._json);
    // create profile
    await this.createProfileProvider.create({
      userId: String(savedUser.id),
      username: profile._json.name,
      givenName: profile._json.given_name,
      familyName: profile._json.family_name,
      picture: profile._json.picture,
    });
    //set user to req.user object
    done(
      null,
      // data which we want to attach with req.user
      {
        id: savedUser.id,
        email: savedUser.email,
        googleId: savedUser.googleId,
      },
    );
  }
}
