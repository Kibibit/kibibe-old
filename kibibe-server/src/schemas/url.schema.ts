import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

export class CreateUrlDto {
  longUrl: string;
}

@Schema()
export class Url {
  @Prop()
  urlCode: string;

  @Prop()
  longUrl: string;

  @Prop()
  clickCount: number;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
