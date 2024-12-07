import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { GoogleOauthGuard } from './guards/google.auth.guard';

@Controller()
export class IamController {
  constructor(private readonly configService: ConfigService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    //  return 'Google Auth Success';
    // Initiates Google OAuth flow
  }

  @Get('/callback')
  @UseGuards(GoogleOauthGuard)
  googleAuthRedirect(@Req() req: Request) {
    return {
      message: 'User Info from Google',
    };
  }
}
