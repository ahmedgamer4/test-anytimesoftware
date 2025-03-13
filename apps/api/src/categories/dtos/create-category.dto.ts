import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Work',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}
