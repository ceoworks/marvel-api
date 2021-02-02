import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { MarvelProxyModule } from './marvel-proxy/marvel-proxy.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    CharacterModule,
    MarvelProxyModule,
    MongooseModule.forRoot('mongodb://localhost/marvel'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
