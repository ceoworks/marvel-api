import { Module } from '@nestjs/common';
import { MarvelProxyModule } from 'src/marvel-proxy/marvel-proxy.module';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
  imports: [MarvelProxyModule],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
