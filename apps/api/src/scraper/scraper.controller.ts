import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LinkedInProfile, LinkedInScraperService } from './scraper.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ScrapeLinkedInDto } from './dtos/scrape.dto';

@ApiTags('linkedin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('linkedin')
export class LinkedInController {
  constructor(
    private readonly linkedInScraperService: LinkedInScraperService,
  ) {}

  @Post('scrape')
  @ApiOperation({ summary: 'Scrape a LinkedIn profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the scraped LinkedIn profile data',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid LinkedIn URL or scraping failed',
  })
  async scrapeProfile(
    @Body() scrapeDto: ScrapeLinkedInDto,
  ): Promise<LinkedInProfile> {
    return this.linkedInScraperService.scrapeProfile(scrapeDto.linkedinUrl);
  }
}
