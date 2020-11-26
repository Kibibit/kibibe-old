import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import * as shortid from 'shortid';
import { isUri } from 'valid-url';
import { UrlService } from './url.service';
import * as nconf from 'nconf';
import { CreateUrlDto, Url } from 'src/schemas/url.schema';

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

      const shortUrl = `${baseUrl}/${urlCode}`;
      url = await this.urlService.create({
        longUrl,
        shortUrl,
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
