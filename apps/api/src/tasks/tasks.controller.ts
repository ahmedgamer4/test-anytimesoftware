import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ✅ Create a new task
  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return await this.tasksService.create(dto);
  }

  // ✅ Get all tasks for a user
  @Get()
  async findByUser(@Query('userId') userId: string) {
    return await this.tasksService.findByUser(userId);
  }

  // ✅ Get a specific task by ID
  @Get(':id')
  async findById(@Param('id') taskId: string) {
    return await this.tasksService.findById(taskId);
  }

  // ✅ Update a task
  @Put(':id')
  async update(@Param('id') taskId: string, @Body() dto: UpdateTaskDto) {
    return await this.tasksService.update(taskId, dto);
  }

  // ✅ Delete a task
  @Delete(':id')
  async delete(@Param('id') taskId: string) {
    return await this.tasksService.delete(taskId);
  }
}
