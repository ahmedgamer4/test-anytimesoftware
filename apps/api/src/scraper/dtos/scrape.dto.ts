import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ScrapeLinkedInDto {
  @ApiProperty()
  @IsUrl()
  linkedinUrl: string;
}
