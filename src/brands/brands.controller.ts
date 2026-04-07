import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { Brand } from './brand.interface';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(): Promise<Brand[]> {
    return this.brandsService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() brand: Omit<Brand, 'id'>): Promise<Brand> {
    return this.brandsService.create(brand);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() brand: Partial<Brand>): Promise<Brand> {
    return this.brandsService.update(+id, brand);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.brandsService.remove(+id);
  }
}

