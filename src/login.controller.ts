import { Body, Controller, Post, Headers } from '@nestjs/common';
import { LoginRequestDto } from './login-request.dto';
import { LoginService } from './login.service';
import { LoginResponseDto } from './login-response.dto';
import { Constants } from './constants';

@Controller('v1')
export class LoginController {
  constructor(private readonly loginSvc: LoginService) {}

  @Post('login')
  public async loginAsync(
    @Body() request: LoginRequestDto,
    @Headers() headers: Record<string, string>
  ): Promise<LoginResponseDto> {
    let sessionId = headers[Constants.SESSION_ID_PROPERTY];
    sessionId = await this.loginSvc.loginAsync(request.username, sessionId);
    return { sessionId };
  }
}
