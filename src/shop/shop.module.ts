import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ShopService } from './shop.service'
import { ShopController } from './shop.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [ShopService, PrismaService],
  controllers: [ShopController]
})
export class ShopModule { }
