import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [PaymentService, PrismaService],
  controllers: [PaymentController],
})
export class PaymentModule {}
