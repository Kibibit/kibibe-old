import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

export class CreateUrlDto {
  longUrl: string;
}

@Schema()
export class Url {
  @Prop({ required: true })
  urlCode: string;

  @Prop({ required: true })
  longUrl: string;

  @Prop()
  clickCount: number;

  @Prop()
  visits: {
    ip: string;
    userAgent: string;
    type: string;
    name: string;
    version: string;
    engine: string;
    os: { name: string; version: string; };
    device: { brand: string; model: string; };
    bot: any;
    date: string;
  }[];
}

export const UrlSchema = SchemaFactory.createForClass(Url);
