import { Injectable } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { UserDataDto } from './user-data.dto';

@Injectable()
export class LoginService {
  constructor(private readonly sessionsSvc: SessionsService) {}

  public async loginAsync(
    username: string,
    sessionId: string,
  ): Promise<string> {
    const userData: UserDataDto = await this.sessionsSvc.getAsync(
      username,
      sessionId,
    );
    if (userData === null) {
      sessionId = this.sessionsSvc.generateSessionID();
      await this.sessionsSvc.updateAsync(username, sessionId);
    }
    return sessionId;
  }
}
