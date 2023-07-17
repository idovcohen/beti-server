import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { StorageService } from './storage.service';
import { SessionsMiddleware } from './sessions.middleware';
import { LoginController } from './login.controller';
import { SessionsService } from './sessions.service';
import { LoginService } from './login.service';
import { ActivityController } from './activity.controller';

@Module({
  imports: [],
  controllers: [LoginController, ActivityController],
  providers: [
    AppService,
    StorageService,
    SessionsService,
    LoginService,
    ActivityController,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SessionsMiddleware).forRoutes('*');
  }
}
