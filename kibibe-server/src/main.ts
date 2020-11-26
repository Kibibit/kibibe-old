import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  await app.listen(config.get('port'));
}
bootstrap();
