import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ groups: ['pending', 'completed'] })
  status?: 'pending' | 'completed';

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  category?: string;
}
