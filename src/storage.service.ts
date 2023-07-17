import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { UserDataDto } from './user-data.dto';
import { Constants } from './constants';

@Injectable()
export class StorageService {
  private readonly client: Redis;
  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  public async setUserDataAsync(
    username: string,
    sessionId: string,
    data: UserDataDto,
  ): Promise<void> {
    const key = `users:${username}:${sessionId}`;
    await this.client.set(key, JSON.stringify(data));
    const EXPIRY_TIME_SECONDS =
      Constants.SESSION_TIMEOUT_SECONDS + Constants.SESSION_BLOCKING_SECONDS;
    await this.client.expire(key, EXPIRY_TIME_SECONDS);
  }

  public async getUserDataAsync(
    username: string,
    sessionId: string,
  ): Promise<UserDataDto> {
    const key = `users:${username}:${sessionId}`;
    const strData: string = await this.client.get(key);
    if (strData) {
      const userData: UserDataDto = JSON.parse(strData);
      return userData;
    } else {
      return null;
    }
  }
}
