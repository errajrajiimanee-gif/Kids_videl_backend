import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { CustomerAuthController } from './customer-auth.controller';
import { UsersModule } from '../users/users.module';

import { LoyaltyModule } from '../loyalty/loyalty.module';
import { MailService } from './mail.service';

@Module({
  imports: [UsersModule, LoyaltyModule],
  controllers: [AdminAuthController, CustomerAuthController],
  providers: [MailService],
  exports: [MailService],
})
export class AuthModule {}
