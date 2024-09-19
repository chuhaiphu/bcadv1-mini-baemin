import { MealDto } from './../_dtos/meal.dto'
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/_guards/role.guard'
import { Roles } from 'src/_guards/role.decorator'
import { MealService } from './meal.service'

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) { }

  @ApiTags('Meal')
  @Get()
  findAllMeals() {
    return this.mealService.findAllMeals()
  }

  @ApiTags('Meal')
  @Get('by-id')
  findMealById(@Query('id') id: string) {
    return this.mealService.findMealById(Number(id))
  }

  @ApiTags('Meal')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Post('add')
  addMeal(@Body() mealData: MealDto) {
    return this.mealService.addMeal(mealData)
  }

  @ApiTags('Meal')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Put('update/:id')
  updateMeal(@Param('id') id: string, @Body() mealData: MealDto) {
    return this.mealService.updateMeal(Number(id), mealData)
  }

  @ApiTags('Meal')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Delete('delete/:id')
  deleteMeal(@Param('id') id: string) {
    return this.mealService.deleteMeal(Number(id))
  }
}
