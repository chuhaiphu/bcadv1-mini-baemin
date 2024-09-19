import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { MealDto } from 'src/_dtos/meal.dto'

@Injectable()
export class MealService {
  constructor(private prisma: PrismaService) {}

  async findAllMeals() {
    return this.prisma.meal.findMany({
      include: { Shop: true, Item_Order: true, Meal_Cart: true }
    })
  }

  async findMealById(id: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { ID: id },
      include: { Shop: true, Item_Order: true, Meal_Cart: true }
    })
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return meal
  }

  async addMeal(mealData: MealDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { ID: mealData.SHOP_ID }
    })
    if (!shop) {
      throw new NotFoundException(`Shop with ID ${mealData.SHOP_ID} not found`)
    }
    return this.prisma.meal.create({
      data: {
        NAME: mealData.NAME,
        IMAGE: mealData.IMAGE,
        PRICE: mealData.PRICE,
        SHOP_ID: mealData.SHOP_ID
      }
    })
  }

  async updateMeal(id: number, mealData: MealDto) {
    const existingMeal = await this.prisma.meal.findUnique({
      where: { ID: id }
    })
    if (!existingMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return this.prisma.meal.update({
      where: { ID: id },
      data: mealData,
    })
  }

  async deleteMeal(id: number) {
    const existingMeal = await this.prisma.meal.findUnique({
      where: { ID: id }
    })
    if (!existingMeal) {
      throw new NotFoundException(`Meal with ID ${id} not found`)
    }
    return this.prisma.meal.delete({
      where: { ID: id },
    })
  }
}
