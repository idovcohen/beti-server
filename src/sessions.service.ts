import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UserDataDto } from './user-data.dto';
import { v4 as uuidv4 } from 'uuid';
import { Constants } from './constants';

@Injectable()
export class SessionsService {
  constructor(private readonly storage: StorageService) {}

  public generateSessionID(): string {
    return uuidv4();
  }

  public updateAsync(username: string, sessionId: string): Promise<void> {
    const sessionData: UserDataDto = {
      lastLoginMs: Date.now(),
      sessionId,
    };
    return this.storage.setUserDataAsync(username, sessionId, sessionData);
  }

  public async getAsync(
    username: string,
    sessionId: string,
  ): Promise<UserDataDto> {
    const userData: UserDataDto = await this.storage.getUserDataAsync(
      username,
      sessionId,
    );
    return userData;
  }

  public async validate(username: string, sessionId: string): Promise<boolean> {
    const userData: UserDataDto = await this.getAsync(username, sessionId);
    if (!userData) {
      return true;
    }

    const timeDiffSeconds = (Date.now() - userData.lastLoginMs) / 1000;
    if (timeDiffSeconds < Constants.SESSION_TIMEOUT_SECONDS) {
      return true;
    }
    if (timeDiffSeconds < Constants.SESSION_TIMEOUT_SECONDS + Constants.SESSION_BLOCKING_SECONDS) {
      return false;
    }

    return true;
  }
}
