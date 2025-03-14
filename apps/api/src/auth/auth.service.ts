import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  LinkedInProfile,
  LinkedInScraperService,
} from '@/scraper/scraper.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private linkedInScraperService: LinkedInScraperService,
  ) {}

  async register(dto: CreateUserDto) {
    const { linkedinUrl } = dto;
    const user = await this.usersService.findByEmail(dto.email);
    if (user) throw new ConflictException('User already exists!');

    let linkedinProfile: LinkedInProfile = {
      name: '',
      photo: '',
      profileUrl: '',
    };
    if (linkedinUrl) {
      try {
        linkedinProfile =
          await this.linkedInScraperService.scrapeProfile(linkedinUrl);
      } catch (error) {
        // Continue registration even if LinkedIn scraping fails
        console.error('LinkedIn scraping failed:', error.message);
      }
    }
    return this.usersService.create({ ...dto, linkedinProfile });
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const matched = await verify(user.password, password);
    if (!matched) throw new UnauthorizedException('User not found');

    return { id: user._id, name: user.name };
  }

  async login(id: string, name: string) {
    const { accessToken } = await this.generateTokens(id);
    return {
      id,
      name,
      accessToken,
    };
  }

  async generateTokens(userId: string) {
    const payload = { sub: userId };
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload),
    ]);

    return {
      accessToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.usersService.findUser(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    const currentUser = {
      id: user._id,
      name: user.name,
    };

    return currentUser;
  }
}
