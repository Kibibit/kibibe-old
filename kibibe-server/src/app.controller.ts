import { Controller, Get, HttpException, Param, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';
import * as nconf from 'nconf';

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
    return this.appService.getPapackageInfo();
  }

  @Get('/:urlCode')
  @Redirect('https://docs.nestjs.com')
  async redirect(
    @Param('urlCode') urlCode,
    @Req() request: Request
  ) {
    const visitInfo = await this.UrlService.getInfoFromClient(request);
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
        console.log(visitInfo);

        const visits = visitInfo;
        await this.UrlService.update(url.urlCode, {
          clickCount,
          $push: {
            visits
          }
        });
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
      console.error(err);

      console.log(err.stack);

      throw new HttpException('There is some internal error.', 500);
    }
  }
}
