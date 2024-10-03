import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePaymentDto } from '../_dtos/payment.dto'

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { ORDER_ID, METHOD, AMOUNT } = createPaymentDto;

    const order = await this.prisma.order.findUnique({
      where: { ID: ORDER_ID },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${ORDER_ID} not found`)
    }

    const payment = await this.prisma.payment.create({
      data: {
        ORDER_ID,
        METHOD,
        AMOUNT,
      },
    })

    return payment
  }

  async getPaymentsByOrderId(orderId: number) {
    return this.prisma.payment.findMany({
      where: { ORDER_ID: orderId },
    })
  }
}
