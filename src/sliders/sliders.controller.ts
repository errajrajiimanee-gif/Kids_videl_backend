import { BadRequestException, Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { Slide } from './slide.interface';
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

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Get()
  async findAll(@Query('category') category?: string): Promise<Slide[]> {
    return this.slidersService.findAll(category);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() slide: Omit<Slide, 'id'>): Promise<Slide> {
    assertImageOk((slide as any)?.image, 'image');
    return this.slidersService.create(slide);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() slide: Partial<Slide>): Promise<Slide> {
    assertImageOk((slide as any)?.image, 'image');
    return this.slidersService.update(+id, slide);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.slidersService.remove(+id);
  }
}
