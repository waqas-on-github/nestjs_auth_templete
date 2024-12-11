import { Injectable } from '@nestjs/common';

import { ResendService } from 'nestjs-resend';

@Injectable()
export class NotificationProvider {
  constructor(private resendService: ResendService) {}

  async sendEmail(verificationLink: string) {
    try {
      return await this.resendService.send({
        from: 'Acme <onboarding@resend.dev>',
        to: 'waqasvu892@gmail.com',
        subject: 'Use verification link to verify your email',
        text: `
        <h1>Use verification link to verify your email</h1>
        <p>Please use the following link to verify your email</p>
        <a href="${verificationLink}">${verificationLink}</a>
        
        `,
      });
    } catch (error) {
      throw error;
    }
  }
}
