import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDate()
  dueDate?: Date;

  @ApiProperty()
  @IsString({ groups: ['pending', 'completed'] })
  status?: 'pending' | 'completed';
}
