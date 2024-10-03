import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ShopModule } from './shop/shop.module';
import { MealModule } from './meal/meal.module';
import { ReviewModule } from './review/review.module';
import { VoucherModule } from './voucher/voucher.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, ShopModule, MealModule, ReviewModule, VoucherModule, OrderModule, PaymentModule, ShippingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
