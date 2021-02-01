import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';
import { MarvelProxyModule } from './marvel-proxy/marvel-proxy.module';

@Module({
  imports: [CharacterModule, MarvelProxyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
