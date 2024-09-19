import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { MealService } from './meal.service'
import { MealController } from './meal.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [MealService, PrismaService],
  controllers: [MealController]
})
export class MealModule { }
