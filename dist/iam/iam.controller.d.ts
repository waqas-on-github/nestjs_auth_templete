import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export declare class IamController {
    private readonly configService;
    constructor(configService: ConfigService);
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: Request): {
        message: string;
    };
}
