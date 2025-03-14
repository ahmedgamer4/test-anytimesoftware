// linkedin/linkedin-scraper.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

export interface LinkedInProfile {
  name?: string;
  photo?: string | null;
  profileUrl?: string | null;
}

@Injectable()
export class LinkedInScraperService {
  private readonly logger = new Logger(LinkedInScraperService.name);

  async scrapeProfile(linkedinUrl: string): Promise<LinkedInProfile> {
    if (!this.isValidLinkedInUrl(linkedinUrl)) {
      throw new BadRequestException('Invalid LinkedIn URL');
    }

    this.logger.log(`Starting to scrape LinkedIn profile: ${linkedinUrl}`);

    let browser;
    try {
      // Launch browser with stealth mode to avoid detection
      browser = await puppeteer.launch({
        // executablePath: '/usr/bin/chromium',
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
        ],
      });

      const page = await browser.newPage();

      // Set a user agent to avoid detection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );

      // Additional settings to avoid detection
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
      });

      // Navigate to the profile
      await page.goto(linkedinUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Check if we need to handle login page or we have direct access to the profile
      const isLoginPage = await page.evaluate(() => {
        return document.querySelector('.authwall-join-form') !== null;
      });

      if (isLoginPage) {
        this.logger.warn(
          'LinkedIn login wall detected. Using alternate scraping method...',
        );
        // Fall back to basic scraping if login wall is detected
        return this.scrapePublicInfo(page);
      }

      // Extract profile information
      const profileData = await page.evaluate(() => {
        const getTextContent = (selector: string) => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() : null;
        };

        // Profile basics
        const name = getTextContent('.text-heading-xlarge');

        // Profile picture
        const profilePicElement = document.querySelector(
          '.pv-top-card-profile-picture__image',
        );
        const photo = profilePicElement
          ? profilePicElement.getAttribute('src')
          : null;

        return {
          name,
          profileUrl: linkedinUrl,
          photo,
        };
      });

      this.logger.log(
        `Successfully scraped data for profile: ${profileData.name}`,
      );
      return profileData;
    } catch (error) {
      this.logger.error(
        `Error scraping LinkedIn profile: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        'Failed to scrape LinkedIn profile: ' + error.message,
      );
    } finally {
      if (browser) {
        await browser.close();
        this.logger.log('Browser closed');
      }
    }
  }

  private async scrapePublicInfo(
    page: puppeteer.Page,
  ): Promise<LinkedInProfile> {
    // If we hit the login wall, we can still try to extract minimal public information
    return await page.evaluate(() => {
      const name = document.querySelector('h1')?.textContent?.trim();
      const headline = document.querySelector('h2')?.textContent?.trim();

      // Try to get profile image even on login wall
      const profileImg =
        document.querySelector('.profile-photo-edit__preview') ||
        document.querySelector('.pv-top-card__photo') ||
        document.querySelector('.profile-picture img');

      const profilePicture = profileImg ? profileImg.getAttribute('src') : null;

      return {
        name,
        headline,
        profilePicture,
      };
    });
  }

  private isValidLinkedInUrl(url: string): boolean {
    // Basic validation for LinkedIn URLs
    return (
      url.startsWith('https://www.linkedin.com/') ||
      url.startsWith('http://www.linkedin.com/') ||
      url.startsWith('https://linkedin.com/') ||
      url.startsWith('http://linkedin.com/') ||
      url.startsWith('www.linkedin.com/') ||
      url.startsWith('linkedin.com/')
    );
  }
}
