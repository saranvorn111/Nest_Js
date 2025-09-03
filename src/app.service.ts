import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const appName = this.configService.get<string>('APP_NAME', 'defaultValue');
    console.log('App Name:', appName);
    return `Hello World! how are you today from ${appName}`;
  }
}
