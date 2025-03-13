// category.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryModel.find({ user: userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({
        _id: id,
        user: userId,
      })
      .exec();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    // Check if category with same name already exists for this user
    const existingCategory = await this.categoryModel
      .findOne({
        name: createCategoryDto.name,
        user: userId,
      })
      .exec();

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    const newCategory = new this.categoryModel({
      ...createCategoryDto,
      user: userId,
    });

    return newCategory.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    // Check if category exists and belongs to user
    await this.findOne(id, userId);

    await this.categoryModel
      .findOneAndDelete({
        _id: id,
        user: userId,
      })
      .exec();
  }

  async getTaskStats(userId: string): Promise<any[]> {
    // Get counts of tasks per category
    const categoryStats = await this.categoryModel
      .aggregate([
        { $match: { user: userId } },
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'category',
            as: 'tasks',
          },
        },
        {
          $project: {
            name: 1,
            totalTasks: { $size: '$tasks' },
            completedTasks: {
              $size: {
                $filter: {
                  input: '$tasks',
                  as: 'task',
                  cond: { $eq: ['$$task.completed', true] },
                },
              },
            },
          },
        },
      ])
      .exec();

    return categoryStats;
  }
}
