import { Module } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';

@Module({
  providers: [SlidersService],
  controllers: [SlidersController]
})
export class SlidersModule {}
