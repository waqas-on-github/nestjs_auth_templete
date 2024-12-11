import { Injectable } from '@nestjs/common';
import { NotificationProvider } from './notification.provider';
import { ConfigService } from '@nestjs/config';
import { TokenProvider } from './tokenProvider';
import { Request } from 'express';

@Injectable()
export class SendVerificationEmailProvider {
  constructor(
    private readonly notificationProvider: NotificationProvider,
    private readonly tokenprovider: TokenProvider,
  ) {}

  async sendUserVerificationEmail(
    userId: number,
    req: Request,
    endPoint: string,
    tokenSecret: string,
  ) {
    //generate jwt token
    const verificationToken = await this.tokenprovider.signToken(
      { id: userId },
      tokenSecret,
      '1h',
    );

    // Dynamically generate the base URL from the request object
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host');
    const verificationLink = `${protocol}://${host}/${endPoint}?token=${verificationToken}`;

    await this.notificationProvider.sendEmail(verificationLink);
  }
}
