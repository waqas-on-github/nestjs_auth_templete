import {
  Body,
  Controller,
  Get,
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
import { VerifyTokenDto } from './dto/verify.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  async verify(@Query() verifyTokenDto: VerifyTokenDto) {
    return await this.iamService.verify(verifyTokenDto);
  }
  // when user click on forgot password button he will be redirected to this route and he need to provide email in request body
  @IsPublic()
  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Req() req: Request,
  ) {
    return await this.iamService.forgotPassword(forgotPasswordDto, req);
  }
  // user will get email with link to reset password and he will be redirected to this route contaning token in query param and validate token then user will be redirected to reset password page

  @IsPublic()
  @Get('/reset-password/verify')
  async resetPasswordLinkVerify(@Query() verifyTokenDto: VerifyTokenDto) {
    return await this.iamService.resetPasswordLinkVerify(verifyTokenDto);
  }
  // when user will be redirected to this route he will provide new password and validate token and then he will be redirected login page
  @IsPublic()
  @Post('/reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Query() verifyTokenDto: VerifyTokenDto,
  ) {
    return await this.iamService.resetPassword(
      resetPasswordDto,
      verifyTokenDto,
    );
  }
}




     