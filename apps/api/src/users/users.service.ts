import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { hash } from 'argon2';
import { LinkedInProfile } from '@/scraper/scraper.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: typeof User) {}

  async create(
    dto: Omit<CreateUserDto, 'linkedinUrl'> & {
      linkedinProfile: LinkedInProfile;
    },
  ) {
    const { password } = dto;
    const hashedPassword = await hash(password);
    const newUser = new this.userModel({ ...dto, password: hashedPassword });
    return newUser.save();
  }

  async findUser(userId: string) {
    const user = this.userModel.findOne({ _id: userId }).exec();
    return user;
  }

  async findByEmail(email: string) {
    const user = this.userModel.findOne({ email }).exec();
    return user;
  }
}
