import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import e, { Request } from 'express';
import { GoogleOauthGuard } from './guards/google.auth.guard';
import { IamService } from './iam.service';

interface googleRequest extends Request {
  user: any;
}
@Controller()
export class IamController {
  constructor(
    private readonly configService: ConfigService,
    private readonly iamService: IamService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    //  return 'Google Auth Success';
    // Initiates Google OAuth flow
  }

  @Get('/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: googleRequest) {
    return await this.iamService.SendJwtToken(req.user);
  }
}
   