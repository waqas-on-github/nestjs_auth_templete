import { Injectable, Req } from '@nestjs/common';
import { NotificationProvider } from './notification.provider';
import { ConfigService } from '@nestjs/config';
import { TokenProvider } from './tokenProvider';
import { Request } from 'express';

@Injectable()
export class SendVerificationEmailProvider {
  constructor(
    private readonly notificationProvider: NotificationProvider,
    private readonly configService: ConfigService,
    private readonly tokenprovider: TokenProvider,
  ) {}

  async sendUserVerificationEmail(userId: number, req: Request) {
    //generate jwt token
    const verificationToken = await this.tokenprovider.signToken(
      { id: userId },
      this.configService.get<string>('VERIFICATION_TOKEN_SECRET'),
      '1h',
    );

    // Dynamically generate the base URL from the request object
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host');
    const verificationLink = `${protocol}://${host}/verify-email?token=${verificationToken}`;

    await this.notificationProvider.sendEmail(verificationLink);
  }
}
