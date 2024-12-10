import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { GoogleOauthGuard } from './guards/google.auth.guard';
import { IamService } from './iam.service';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { IsPublic } from './decorators/isPublic';
import { SignInDto } from './dto/signIn.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyDto } from './dto/verify.dto';

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
    // Initiates Google OAuth flow
  }

  @IsPublic()
  @Get('/callback') // after auth complete google callback this url  and provide userdat as
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: googleRequest) {
    return await this.iamService.SignInOauthUser(req.user);
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
  async signUp(@Body() signUpDto: SignInDto, @Req() req: Request) {
    return this.iamService.SingUp(signUpDto, req);
  }

  @IsPublic()
  @Post('/refresh')
  async Refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.iamService.Refresh(refreshTokenDto);
  }

  @IsPublic()
  @Get('/verify-email')
  async verify(@Query() verifyDto: VerifyDto) {
    return await this.iamService.verify(verifyDto);
  }
}
