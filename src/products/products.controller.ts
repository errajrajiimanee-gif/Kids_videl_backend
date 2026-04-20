import { BadRequestException, Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.interface';
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('sex') sex?: string,
    @Query('ageGroup') ageGroup?: string,
    @Query('brandId') brandId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string
  ): Promise<Product[]> {
    return this.productsService.findAll({ category, subCategory, sex, ageGroup, brandId, minPrice, maxPrice });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(+id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() product: Omit<Product, 'id'>): Promise<Product> {
    assertImageOk((product as any)?.image, 'image');
    return this.productsService.create(product);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() product: Partial<Product>): Promise<Product> {
    assertImageOk((product as any)?.image, 'image');
    return this.productsService.update(+id, product);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.productsService.remove(+id);
  }
}
