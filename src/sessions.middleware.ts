import { HttpException, HttpStatus, NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Injectable()
export class SessionsMiddleware implements NestMiddleware {
  constructor(private readonly sessionsSvc: SessionsService) {}

  public async use(
    req: Request,
    res: Response,
    next: (error?: any) => void,
  ): Promise<void> {
    const headers = req.headers;
    const authorizationHeader = headers['authorization'];
    const sessionId = headers['session-id'];
    if (authorizationHeader) {
      const authValue: string = authorizationHeader.replace('Basic ', '');
      const authBuffer = Buffer.from(authValue, 'base64');
      const authText = authBuffer.toString('ascii');
      const [username, password] = authText.split(':');
      const validated = await this.sessionsSvc.validate(username, sessionId);
      if (validated) {
        next();
      } else {
        throw new HttpException(
          'Too many requests.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } else {
      next();
    }
  }
}
