import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) throw new ConflictException('User already exists!');
    return this.usersService.create(dto);
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
