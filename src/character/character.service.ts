import { Injectable } from '@nestjs/common';
import { MarvelProxyService } from 'src/marvel-proxy/marvel-proxy.service';

@Injectable()
export class CharacterService {
  constructor(private readonly marvelProxyService: MarvelProxyService) {}
  async getCharactersIds(): Promise<number[]> {
    const characters = await this.marvelProxyService.getCharacters();
    return characters.map((ch) => ch.id);
  }
  async getCharacterInfo(paramId: string) {
    const {
      id,
      name,
      description,
    } = await this.marvelProxyService.getCharacterInfo(paramId);
    return { id, name, description };
  }
}
