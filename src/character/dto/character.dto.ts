import { ApiProperty } from '@nestjs/swagger';

export class CharacterResponseDto {
  id: number;

  name: string;

  description: string;
}
