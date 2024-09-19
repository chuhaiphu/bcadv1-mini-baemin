import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ShopDto } from '../_dtos/shop.dto'

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async findAllShops() {
    return this.prisma.shop.findMany({
      include: { Meal: true, Review: true }
    })
  }

  async findShopById(id: number) {
    return this.prisma.shop.findUnique({
      where: { ID: id },
      include: { Meal: true, Review: true }
    })
  }

  async addShop(shopData: ShopDto) {
    const openTime = new Date();
    const [openHours, openMinutes] = shopData.OPEN_TIME.split(':');
    openTime.setUTCHours(parseInt(openHours), parseInt(openMinutes), 0, 0);
    
    const closeTime = new Date();
    const [closeHours, closeMinutes] = shopData.CLOSE_TIME.split(':');
    closeTime.setUTCHours(parseInt(closeHours), parseInt(closeMinutes), 0, 0);
    
    return this.prisma.shop.create({
      data: {
        NAME: shopData.NAME,
        ADDRESS: shopData.ADDRESS,
        OPEN_TIME: openTime,
        CLOSE_TIME: closeTime,
        IS_ENABLE: shopData.IS_ENABLE
      }
    })
  }

  async updateShop(id: number, shopData: ShopDto) {
    const openTime = new Date();
    const [openHours, openMinutes] = shopData.OPEN_TIME.split(':');
    openTime.setUTCHours(parseInt(openHours), parseInt(openMinutes), 0, 0);
  
    const closeTime = new Date();
    const [closeHours, closeMinutes] = shopData.CLOSE_TIME.split(':');
    closeTime.setUTCHours(parseInt(closeHours), parseInt(closeMinutes), 0, 0);
  
    return this.prisma.shop.update({
      where: { ID: id },
      data: {
        ...shopData,
        OPEN_TIME: openTime,
        CLOSE_TIME: closeTime,
      },
    })
  }
  

  async deleteShop(id: number) {
    return this.prisma.shop.delete({
      where: { ID: id },
    })
  }
}
