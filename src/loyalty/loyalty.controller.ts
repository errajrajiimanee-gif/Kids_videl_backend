import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { LoyaltyMember } from './loyalty.interface';
import { LoyaltyService } from './loyalty.service';

@Controller('loyalty')
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll(): Promise<LoyaltyMember[]> {
    return this.loyaltyService.findAll();
  }

  @Post()
  async create(@Body() body: Omit<LoyaltyMember, 'id' | 'createdAt'>): Promise<LoyaltyMember> {
    return this.loyaltyService.create(body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: Partial<LoyaltyMember>): Promise<LoyaltyMember> {
    return this.loyaltyService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.loyaltyService.remove(+id);
  }
}
