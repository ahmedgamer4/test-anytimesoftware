import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: typeof User) {}

  async create(dto: CreateUserDto) {
    const { password } = dto;
    const hashedPassword = await hash(password);
    const newUser = new this.userModel({ ...dto, password: hashedPassword });
    return newUser.save();
  }

  async findUser(userId: string) {
    const user = this.userModel.findOne({ id: userId }).exec();
    return user;
  }

  async findByEmail(email: string) {
    const user = this.userModel.findOne({ email }).exec();
    return user;
  }
}
