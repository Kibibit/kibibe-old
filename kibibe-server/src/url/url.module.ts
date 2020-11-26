import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlService } from './url.service';
import { Url, UrlSchema } from '../schemas/url.schema';
import { UrlController } from './url.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  providers: [UrlService],
  controllers: [UrlController],
  exports: [UrlService]
})
export class UrlModule {}
