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
import { GetUser } from '@/auth/decorators/get-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return await this.tasksService.create(dto);
  }

  @Get()
  async findByUser(@GetUser() userId: string) {
    return await this.tasksService.findByUser(userId);
  }

  @Get(':id')
  async findById(@Param('id') taskId: string) {
    return await this.tasksService.findById(taskId);
  }

  @Put(':id')
  async update(@Param('id') taskId: string, @Body() dto: UpdateTaskDto) {
    return await this.tasksService.update(taskId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') taskId: string) {
    return await this.tasksService.delete(taskId);
  }
}
