import { Injectable } from '@nestjs/common';
import * as nconf from 'nconf';
import { join } from 'path';

export interface IKibibeConfig {
  mongo: string;
  port: number;
}

@Injectable()
export class ConfigService {
  readonly projectBase: string = __dirname.replace(/kibibe.*$/, 'kibibe');
  private readonly nconf = nconf;
  defaults: IKibibeConfig = {
    mongo: 'mongodb://localhost:27017/kibibe',
    port: 10101
  }

  constructor() {
    this.nconf
    .argv()
    .env()
    .file({ file: join(this.projectBase, 'config.json') })
    .defaults(this.defaults);
  }

  get(name: string) {
    return this.nconf.get(name);
  }
}
