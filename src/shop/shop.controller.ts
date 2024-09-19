import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/_guards/role.guard';
import { Roles } from 'src/_guards/role.decorator';
import { ShopDto } from '../_dtos/shop.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) { }

  @ApiTags('Shop')
  @Get()
  findAllShops() {
    return this.shopService.findAllShops()
  }

  @ApiTags('Shop')
  @Get('by-id')
  findShopById(@Query('id') id: string) {
    return this.shopService.findShopById(Number(id))
  }

  @ApiTags('Shop')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Post('add')
  addShop(@Body() shopData: ShopDto) {
    return this.shopService.addShop(shopData)
  }

  @ApiTags('Shop')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Put('update/:id')
  updateShop(@Param('id') id: string, @Body() shopData: ShopDto) {
    return this.shopService.updateShop(Number(id), shopData)
  }

  @ApiTags('Shop')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Delete('delete/:id')
  deleteShop(@Param('id') id: string) {
    return this.shopService.deleteShop(Number(id))
  }
}