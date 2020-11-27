import { Injectable } from '@nestjs/common';
import { readJsonSync } from 'fs-extra';
import { pick } from 'lodash';
import { join } from 'path';

import { ConfigService } from './config/config.service';

export interface IKibibeInfo {
  version: string;
  name: string;
  description: string;
  repository: {
    type: string;
    url: string;
  };
  bugs: {
    url: string;
  };
  keywords: string[];
}

@Injectable()
export class AppService {
  packageInfo: IKibibeInfo;

  constructor(private configService: ConfigService) {
    let rawPackage = readJsonSync(join(this.configService.projectBase, 'package.json'));
    rawPackage = pick(rawPackage, [
      'version',
      'name',
      'description',
      'repository',
      'bugs',
      'keywords'
    ]);
    this.packageInfo = rawPackage;
  }

  getPapackageInfo(): IKibibeInfo {
    return this.packageInfo;
  }
}
