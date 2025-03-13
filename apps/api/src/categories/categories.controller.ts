// category.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category has been created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with that name already exists',
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() userId: string,
  ) {
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of categories returned',
  })
  findAll(@GetUser() userId: string) {
    return this.categoryService.findAll(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get category statistics with task counts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category statistics returned',
  })
  getStats(@GetUser() userId: string) {
    return this.categoryService.getTaskStats(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  remove(@Param('id') id: string, @GetUser() userId: string) {
    return this.categoryService.remove(id, userId);
  }
}
