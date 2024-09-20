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

  async addMealToUserCart(userId: number, mealId: number, quantity: number) {
    const meal = await this.prisma.meal.findUnique({ where: { ID: mealId } })
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${mealId} not found`)
    }

    const user = await this.prisma.user.findUnique({
      where: { ID: userId },
      include: { Cart: true }
    });
  
    if (!user || !user.Cart) {
      throw new NotFoundException(`User with ID ${userId} not found or has no cart`)
    }

    return this.prisma.meal_Cart.create({
      data: {
        MEAL_ID: mealId,
        CART_ID: user.Cart.ID,
        QUANTITY: quantity
      }
    })
  }

  async removeMealFromCart(mealCartId: number) {
    const mealCart = await this.prisma.meal_Cart.findUnique({ where: { ID: mealCartId } })
    if (!mealCart) {
      throw new NotFoundException(`Meal_Cart with ID ${mealCartId} not found`)
    }

    return this.prisma.meal_Cart.delete({
      where: { ID: mealCartId }
    })
  }

  async updateMealCartQuantity(mealCartId: number, quantity: number) {
    const mealCart = await this.prisma.meal_Cart.findUnique({ where: { ID: mealCartId } })
    if (!mealCart) {
      throw new NotFoundException(`Meal_Cart with ID ${mealCartId} not found`)
    }

    return this.prisma.meal_Cart.update({
      where: { ID: mealCartId },
      data: { QUANTITY: quantity }
    })
  }
}
