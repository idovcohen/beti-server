import { Controller, Get } from '@nestjs/common';

@Controller('v1')
export class ActivityController {
  @Get('activity')
  public async activateAsync(): Promise<void> {}
}
