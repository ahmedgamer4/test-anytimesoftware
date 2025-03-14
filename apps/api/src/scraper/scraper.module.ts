import { Module } from '@nestjs/common';
import { LinkedInScraperService } from './scraper.service';
import { LinkedInController } from './scraper.controller';

@Module({
  providers: [LinkedInScraperService],
  controllers: [LinkedInController],
  exports: [LinkedInScraperService],
})
export class LinkedInModule {}
