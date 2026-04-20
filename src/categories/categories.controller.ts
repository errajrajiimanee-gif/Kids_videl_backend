import { BadRequestException, Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.interface';
import { AdminGuard } from '../auth/admin.guard';

const MAX_DATA_URI_LENGTH = 200_000;

const assertImageOk = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string') return;
  const v = value.trim();
  if (!v.startsWith('data:image')) return;
  if (v.length > MAX_DATA_URI_LENGTH) {
    throw new BadRequestException(`${fieldName}: image trop lourde. Utilisez une URL ou une image plus légère.`);
  }
};

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
    assertImageOk((category as any)?.image, 'image');
    const subs = (category as any)?.subCategories;
    if (Array.isArray(subs)) subs.forEach((s: any) => assertImageOk(s?.image, 'subCategories.image'));
    return this.categoriesService.create(category);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() category: Partial<Category>): Promise<Category> {
    assertImageOk((category as any)?.image, 'image');
    const subs = (category as any)?.subCategories;
    if (Array.isArray(subs)) subs.forEach((s: any) => assertImageOk(s?.image, 'subCategories.image'));
    return this.categoriesService.update(+id, category);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.categoriesService.remove(+id);
  }
}
