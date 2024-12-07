import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import e, { Request } from 'express';
import { GoogleOauthGuard } from './guards/google.auth.guard';

interface googleRequest extends Request {
  user: any;
}
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
      user: req.user,
    };
  }
}
