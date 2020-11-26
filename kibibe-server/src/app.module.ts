import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { UrlModule } from './url/url.module';

const config = new ConfigService();

@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongo')),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
