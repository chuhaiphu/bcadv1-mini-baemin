import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/_guards/role.guard'
import { Roles } from 'src/_guards/role.decorator'
import { OrderService } from './order.service'
import { UpdateOrderStatusDto } from 'src/_dtos/order.dto'

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) { }

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Post('create')
  createOrder(
    @Request() req: { user: { userId: any, email: any, role: any } },
  ) {
    return this.orderService.createOrder(req.user.userId)
  }

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Post(':id/apply-voucher')
  applyVoucher(@Param('id') id: string, @Query("voucherCode") voucherCode: string) {
    return this.orderService.applyVoucher(Number(id), voucherCode)
  }

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Post(':id/unapply-all-vouchers')
  unapplyAllVouchers(@Param('id') id: string) {
    return this.orderService.unapplyAllVouchers(Number(id))
  }  

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Get()
  findAllOrders() {
    return this.orderService.findAllOrders()
  }

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Get(':id')
  findOrderById(@Param('id') id: string) {
    return this.orderService.findOrderById(Number(id))
  }

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Put('update-status/:id')
  updateOrderStatus(@Param('id') id: string, @Body() updateData: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(Number(id), updateData)
  }

  @ApiTags('Order')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Delete('delete/:id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(Number(id))
  }

}
