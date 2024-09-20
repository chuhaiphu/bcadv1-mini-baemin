import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [ReviewService, PrismaService],
  controllers: [ReviewController]
})
export class ReviewModule { }
