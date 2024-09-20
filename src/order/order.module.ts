import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [OrderService, PrismaService],
  controllers: [OrderController]
})
export class OrderModule { }
