import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UsersService } from '@/users/users.service';
import { Model, Types } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateTaskDto) {
    // if (new Date(dto.dueDate) < new Date()) {
    //   throw new Error('Due date cannot be in the past');
    // }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const user = await this.usersService.findUser(userId);
    if (!user) throw new NotFoundException('User not found');

    const newTask = new this.taskModel({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      category: dto.category ? new Types.ObjectId(dto.category) : null,
      user: user._id,
    });
    return await newTask.save();
  }

  async findById(taskId: string) {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findByUser(userId: string) {
    return await this.taskModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('category', 'name')
      .exec();
  }

  async update(taskId: string, dto: UpdateTaskDto) {
    const updateData = { ...dto };

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(taskId, updateData, { new: true })
      .exec();
    if (!updatedTask) throw new NotFoundException('Task not found');
    return updatedTask;
  }

  async delete(taskId: string) {
    const deletedTask = await this.taskModel.findByIdAndDelete(taskId).exec();
    if (!deletedTask) throw new NotFoundException('Task not found');
  }
}
