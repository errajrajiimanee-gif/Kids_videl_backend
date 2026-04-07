import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.interface';
import { AdminGuard } from '../auth/admin.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() category: Omit<Category, 'id'>): Promise<Category> {
    return this.categoriesService.create(category);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() category: Partial<Category>): Promise<Category> {
    return this.categoriesService.update(+id, category);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.categoriesService.remove(+id);
  }
}
