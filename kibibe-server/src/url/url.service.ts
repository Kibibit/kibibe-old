import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from '../schemas/url.schema';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async create(createUrlDto: Url): Promise<Url> {
    const createdUrl = new this.urlModel(createUrlDto);
    console.log('about to create ', createdUrl);
    return createdUrl.save();
  }

  async update(url: Url) {
    return this.urlModel.update({ urlCode: url.urlCode }, url);
  }

  async findOne(findObj: Partial<Url>): Promise<Url> {
    return this.urlModel.findOne(findObj);
  }

  async findAll(): Promise<Url[]> {
    return this.urlModel.find().exec();
  }
}
