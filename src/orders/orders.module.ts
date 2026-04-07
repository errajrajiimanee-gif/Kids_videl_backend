import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ProductsModule, LoyaltyModule, UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
