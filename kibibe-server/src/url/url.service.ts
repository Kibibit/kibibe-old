import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import DeviceDetector = require('device-detector-js');
import { Request } from 'express';
import { get } from 'lodash';
import { Model } from 'mongoose';
import * as nodeGeocoder from 'node-geocoder';
import * as satelize from 'satelize';

import { Url, UrlDocument } from '../schemas/url.schema';

const geocoderOptions = {
  provider: 'openstreetmap',
  language: 'en'
};
@Injectable()
export class UrlService {
  deviceDetector = new DeviceDetector();
  geoCoder = nodeGeocoder(geocoderOptions);
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async create(createUrlDto: Partial<Url>): Promise<Url> {
    const createdUrl = new this.urlModel(createUrlDto);
    console.log('about to create ', createdUrl);
    return createdUrl.save();
  }

  async update(urlCode: string, url: any) {
    return this.urlModel.updateOne({ urlCode }, url);
  }

  async findOne(findObj: Partial<Url>): Promise<Url> {
    return this.urlModel.findOne(findObj);
  }

  async findAll(): Promise<Url[]> {
    return this.urlModel.find().exec();
  }

  async getInfoFromClient(request: Request) {
    const ip = request.header('x-forwarded-for') || request.connection.remoteAddress;
    const userAgent = request.header('user-agent');
    const device = this.deviceDetector.parse(userAgent);
    const IPS: any = await this.getISP(ip);
    const geolocation = await this.geoCoder.reverse({ lat: IPS.latitude, lon: IPS.longitude });

    console.log(geolocation);
    
    return {
      type: get(device, 'client.type'),
      name: get(device, 'client.name'),
      version: get(device, 'client.version'),
      os: { name: get(device, 'os.name'), version: get(device, 'os.version') },
      device: { brand: get(device, 'device.brand'), model: get(device, 'device.model') },
      bot: get(device, 'bot'),
      continent: get(IPS, 'continent.en'),
      country: get(IPS, 'country.en'),
      timezone: get(IPS, 'timezone'),
      ip,
      userAgent,
      date: new Date().toISOString()
    };
  }

  private async getISP(ip: string) {
    return new Promise((resolve, reject) => {
      satelize.satelize({ ip }, function(err, geoData) {
        if (err) {
          reject(err);
        } else {
          resolve(geoData);
        }
      });
    })
  }
}
