import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import e, { Request } from 'express';
import { GoogleOauthGuard } from './guards/google.auth.guard';
import { IamService } from './iam.service';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { IsPublic } from './decorators/isPublic';
import { SignInDto } from './dto/signIn.dto';

interface googleRequest extends Request {
  user: any;
}
@Controller()
export class IamController {
  constructor(
    private readonly configService: ConfigService,
    private readonly iamService: IamService,
  ) {}
  @IsPublic()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    //  return 'Google Auth Success';
    // Initiates Google OAuth flow
  }
  @IsPublic()
  @Get('/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: googleRequest) {
    return await this.iamService.SendJwtToken(req.user);
  }
  @Get('/proctected')
  @UseGuards(JwtAuthGuard)
  async protected() {
    return 'protected route';
  }
  @IsPublic()
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.iamService.SignIn(signInDto);
  }

  @IsPublic()
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignInDto) {
    return this.iamService.SingUp(signUpDto);
  }
}
