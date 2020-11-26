import { NestFactory } from '@nestjs/core';
import * as nconf from 'nconf';
import { join } from 'path';

import { AppModule } from './app.module';

nconf
  .argv()
  .env()
  .file({ file: join(__dirname.replace(/kibibe.*$/, 'kibibe'), 'config.json') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
