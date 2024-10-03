import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ShippingService } from './shipping.service'
import { ShippingController } from './shipping.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [ShippingService, PrismaService],
  controllers: [ShippingController]
})
export class ShippingModule {}
