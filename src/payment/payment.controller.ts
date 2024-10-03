import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/_guards/role.guard'
import { Roles } from 'src/_guards/role.decorator'
import { PaymentService } from './payment.service'
import { CreatePaymentDto } from 'src/_dtos/payment.dto'

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiTags('Payment')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Post('create')
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: { user: { userId: any, email: any, role: any } },
  ) {
    return this.paymentService.createPayment(createPaymentDto)
  }

  @ApiTags('Payment')
  @UseGuards(AuthGuard("jwt-token-strat"))
  @Get('order/:orderId')
  getPaymentsByOrderId(@Param('orderId') orderId: string) {
    return this.paymentService.getPaymentsByOrderId(Number(orderId))
  }

  @ApiTags('Payment')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Get()
  getAllPayments() {
    // Implement this method in PaymentService if needed
    // return this.paymentService.getAllPayments();
  }
}
