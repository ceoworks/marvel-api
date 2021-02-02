import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CacheDocument = Cache & Document;

@Schema()
export class Cache {
  @Prop()
  ids: number[];

  @Prop()
  total: number;

  @Prop()
  createdAt: Date;

  @Prop()
  refreshedAt: Date;
}

export const CacheSchema = SchemaFactory.createForClass(Cache);
