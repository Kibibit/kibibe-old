import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import * as nconf from 'nconf';
import * as shortid from 'shortid';
import { isUri } from 'valid-url';

import { CreateUrlDto } from '../schemas/url.schema';
import { UrlService } from './url.service';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async shortenUrl(@Body() shortenUrlDto: CreateUrlDto) {
    const longUrl = shortenUrlDto.longUrl;
    const baseUrl = nconf.get('baseURL');

    if (!isUri(baseUrl)) {
      throw new HttpException(
        'Internal error. Please come back later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const urlCode = shortid.generate();

    if (!isUri(longUrl)) {
      throw new HttpException(
        'Invalid URL. Please enter a vlaid url for shortening.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      let url = await this.urlService.findOne({ longUrl });

      if (url) {
        return url;
      }

      url = await this.urlService.create({
        longUrl,
        urlCode,
        clickCount: 0,
      });

      return url;
    } catch (err) {
      throw new HttpException(
        `Internal Server error: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
