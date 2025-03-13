import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  description: string;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  category?: string;
}
