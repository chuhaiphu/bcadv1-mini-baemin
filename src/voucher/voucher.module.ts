import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { VoucherService } from './voucher.service'
import { VoucherController } from './voucher.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [VoucherService, PrismaService],
  controllers: [VoucherController],
})
export class VoucherModule {}
