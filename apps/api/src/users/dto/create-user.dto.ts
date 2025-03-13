import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsUrl()
  linkedInUrl: string;
}
