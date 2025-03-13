import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

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
  @IsDate()
  dueDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ groups: ['pending', 'completed'] })
  status?: 'pending' | 'completed';
}
