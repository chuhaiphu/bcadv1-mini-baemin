import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateShippingDto, UpdateShippingDto } from '../_dtos/shipping.dto'

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async createShipping(createShippingDto: CreateShippingDto) {
    const order = await this.prisma.order.findUnique({
      where: { ID: createShippingDto.ORDER_ID },
    })

    if (!order) {
      throw new NotFoundException(`Order with ID ${createShippingDto.ORDER_ID} not found`)
    }

    return this.prisma.shipping.create({
      data: createShippingDto,
    })
  }

  async findAllShippings() {
    return this.prisma.shipping.findMany({
      include: { Order: true },
    })
  }

  async findShippingById(id: number) {
    const shipping = await this.prisma.shipping.findUnique({
      where: { ID: id },
      include: { Order: true },
    })

    if (!shipping) {
      throw new NotFoundException(`Shipping with ID ${id} not found`)
    }

    return shipping;
  }

  async updateShippingStatus(id: number, updateShippingDto: UpdateShippingDto) {
    const existingShipping = await this.prisma.shipping.findUnique({
      where: { ID: id },
    })

    if (!existingShipping) {
      throw new NotFoundException(`Shipping with ID ${id} not found`);
    }

    return this.prisma.shipping.update({
      where: { ID: id },
      data: { STATUS: updateShippingDto.STATUS },
    })
  }

  async deleteShipping(id: number) {
    const existingShipping = await this.prisma.shipping.findUnique({
      where: { ID: id },
    })

    if (!existingShipping) {
      throw new NotFoundException(`Shipping with ID ${id} not found`);
    }

    return this.prisma.shipping.delete({
      where: { ID: id },
    })
  }
}
