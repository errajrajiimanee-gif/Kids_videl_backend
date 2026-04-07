import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SlidersModule } from './sliders/sliders.module';
import { BrandsModule } from './brands/brands.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { LoyaltyModule } from './loyalty/loyalty.module';

@Module({
  imports: [ProductsModule, CategoriesModule, SlidersModule, BrandsModule, OrdersModule, AuthModule, LoyaltyModule]
})
export class AppModule {}
