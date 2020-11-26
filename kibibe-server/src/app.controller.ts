import { Controller, Get, Headers, HttpException, Param, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';
import * as nconf from 'nconf';
import * as useragent from 'useragent';

import { AppService, IKibibeInfo } from './app.service';
import { UrlService } from './url/url.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private UrlService: UrlService,
  ) {}

  @Get()
  getHello(): IKibibeInfo {
    return this.appService.getHello();
  }

  @Get('/:urlCode')
  @Redirect('https://docs.nestjs.com')
  async redirect(
    @Param('urlCode') urlCode,
    @Headers() clientInfo,
    @Req() request: Request,
  ) {
    console.log(clientInfo);
    const ip = request.header('x-forwarded-for') || request.connection.remoteAddress;

    console.log({ ...useragent.parse(clientInfo['user-agent']), ip});

    const url = await this.UrlService.findOne({ urlCode });

    const allowedClicks = nconf.get('allowedClick') || 50000;

    try {
      if (url) {
        let clickCount = url.clickCount;
        if (clickCount >= allowedClicks) {
          console.log(
            'The click count for shortcode ' +
              urlCode +
              ' has passed the limit of ' +
              allowedClicks,
          );
          throw new HttpException(
            'The click count for shortcode ' +
              urlCode +
              ' has passed the limit of ' +
              allowedClicks,
            400,
          );
        }
        clickCount++;

        url.clickCount = clickCount;
        await this.UrlService.update(url);
        return { url: url.longUrl };
      } else {
        throw new HttpException(
          `The short url doesn't exists in our system.`,
          400,
        );
      }
    } catch (err) {
      console.error(
        'Error while retrieving long url for shorturlcode ' + urlCode,
      );

      throw new HttpException('There is some internal error.', 500);
    }
  }
}
