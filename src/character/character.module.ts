import { Module } from '@nestjs/common';
import { MarvelProxyModule } from 'src/marvel-proxy/marvel-proxy.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { Cache, CacheSchema } from './schemas/cache.schema';

@Module({
  imports: [
    MarvelProxyModule,
    MongooseModule.forFeature([{ name: Cache.name, schema: CacheSchema }]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
