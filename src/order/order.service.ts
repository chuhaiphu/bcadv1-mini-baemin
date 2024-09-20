import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateOrderStatusDto } from 'src/_dtos/order.dto'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number) {
    let total = 0;
    const order = await this.prisma.order.create({
      data: {
        USER_ID: userId,
        STATUS: 'Pending',
      },
    })
  
    const userCart = await this.prisma.meal_Cart.findMany({
      where: {
        Cart: { USER_ID: userId }
      },
      include: { Meal: true }
    })
  
    for (const mealCart of userCart) {
      const itemTotal = mealCart.QUANTITY * Number(mealCart.Meal.PRICE)
      total += itemTotal;
  
      await this.prisma.item_Order.create({
        data: {
          ORDER_ID: order.ID,
          MEAL_ID: mealCart.MEAL_ID,
          QUANTITY: mealCart.QUANTITY,
          ITEM_PRICE: mealCart.Meal.PRICE,
        }
      })
  
      await this.prisma.meal_Cart.delete({ where: { ID: mealCart.ID } })
    }
  
    const updatedOrder = await this.prisma.order.update({
      where: { ID: order.ID },
      data: { TOTAL: total },
      include: { Item_Order: true },
    })
  
    return updatedOrder;
  }
  
  
  async applyVoucher(orderId: number, voucherCode: string) {
    const order = await this.prisma.order.findUnique({
      where: { ID: orderId },
      include: { Voucher_Order: { include: { Voucher: true } } },
    })
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }
  
    const voucher = await this.prisma.voucher.findUnique({
      where: { CODE: voucherCode },
    })
  
    if (!voucher) {
      throw new NotFoundException(`Voucher with code ${voucherCode} not found`)
    }
  
    // Check voucher usage limit
    const voucherUsageCount = await this.prisma.voucher_Order.count({
      where: { VOUCHER_ID: voucher.ID },
    })
  
    if (voucherUsageCount >= voucher.USAGE_LIMIT) {
      throw new Error('Voucher usage limit has been reached')
    }
  
    if (order.TOTAL < voucher.MIN_ORDER_VALUE) {
      throw new Error('Order total does not meet the minimum value for this voucher')
    }
  
    let discount = 0
    if (voucher.DISCOUNT_TYPE === 'Percentage') {
      discount = Number(order.TOTAL) * (Number(voucher.DISCOUNT_AMOUNT) / 100)
    } else {
      discount = Number(voucher.DISCOUNT_AMOUNT)
    }
  
    const newTotal = Number(order.TOTAL) - discount
  
    await this.prisma.voucher_Order.create({
      data: {
        ORDER_ID: orderId,
        VOUCHER_ID: voucher.ID,
      },
    })
  
    const updatedOrder = await this.prisma.order.update({
      where: { ID: orderId },
      data: { TOTAL: newTotal },
      include: { Item_Order: true, Voucher_Order: { include: { Voucher: true } } },
    })
  
    return updatedOrder
  }
  
  async unapplyAllVouchers(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { ID: orderId },
      include: { Voucher_Order: { include: { Voucher: true } } },
    })
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`)
    }
  
    let newTotal = Number(order.TOTAL)
  
    // Sort Voucher_Order by ID in descending order to unapply from last to first
    const sortedVoucherOrders = order.Voucher_Order.sort((a, b) => b.ID - a.ID)
  
    for (const voucherOrder of sortedVoucherOrders) {
      const voucher = voucherOrder.Voucher
  
      let addBack = 0
      if (voucher.DISCOUNT_TYPE === 'Percentage') {
        addBack = newTotal / (1 - Number(voucher.DISCOUNT_AMOUNT) / 100) - newTotal
      } else {
        addBack = Number(voucher.DISCOUNT_AMOUNT)
      }
  
      newTotal += addBack
  
      await this.prisma.voucher_Order.delete({
        where: { ID: voucherOrder.ID },
      })
    }
  
    const updatedOrder = await this.prisma.order.update({
      where: { ID: orderId },
      data: { TOTAL: newTotal },
      include: { Item_Order: true, Voucher_Order: { include: { Voucher: true } } },
    })
  
    return updatedOrder
  }
  
  

  async findAllOrders() {
    return this.prisma.order.findMany({
      include: { Item_Order: true, User: true }
    })
  }

  async findOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { ID: id },
      include: { Item_Order: true, User: true }
    })
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(id: number, updateData: UpdateOrderStatusDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { ID: id }
    })
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return this.prisma.order.update({
      where: { ID: id },
      data: { STATUS: updateData.STATUS, UPDATE_AT: new Date() },
    })
  }

  async deleteOrder(id: number) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { ID: id }
    })
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return this.prisma.order.delete({
      where: { ID: id },
    })
  }
}
