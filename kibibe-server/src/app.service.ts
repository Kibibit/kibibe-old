import { Injectable } from '@nestjs/common';

export interface IKibibeInfo {
  version: string;
}

@Injectable()
export class AppService {
  getHello(): IKibibeInfo {
    return {
      version: process.env.npm_package_version
    };
  }
}
