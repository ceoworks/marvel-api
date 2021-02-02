import { Controller, Get, Param } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterResponseDto } from './dto/character.dto';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  async getCharactersIds(): Promise<number[]> {
    return this.characterService.getCharactersIds();
  }

  @Get(':id')
  async getCharacter(@Param() params): Promise<CharacterResponseDto> {
    return this.characterService.getCharacterInfo(params.id as string);
  }
}
