import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/_guards/role.guard'
import { Roles } from 'src/_guards/role.decorator'
import { ShippingService } from './shipping.service'
import { CreateShippingDto, UpdateShippingDto } from '../_dtos/shipping.dto'

@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @ApiTags('Shipping')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Post('create')
  createShipping(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingService.createShipping(createShippingDto)
  }

  @ApiTags('Shipping')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Get()
  findAllShippings() {
    return this.shippingService.findAllShippings()
  }

  @ApiTags('Shipping')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Get(':id')
  findShippingById(@Param('id') id: string) {
    return this.shippingService.findShippingById(Number(id))
  }

  @ApiTags('Shipping')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Put('update-status/:id')
  updateShippingStatus(@Param('id') id: string, @Body() updateData: UpdateShippingDto) {
    return this.shippingService.updateShippingStatus(Number(id), updateData)
  }

  @ApiTags('Shipping')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Delete('delete/:id')
  deleteShipping(@Param('id') id: string) {
    return this.shippingService.deleteShipping(Number(id))
  }
}
