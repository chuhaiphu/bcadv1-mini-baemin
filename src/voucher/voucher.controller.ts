import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/_guards/role.guard'
import { Roles } from 'src/_guards/role.decorator'
import { VoucherService } from './voucher.service'
import { VoucherDto } from 'src/_dtos/voucher.dto'

@Controller('voucher')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}

  @ApiTags('Voucher')
  @Get()
  findAllVouchers() {
    return this.voucherService.findAllVouchers()
  }

  @ApiTags('Voucher')
  @Get('by-id')
  findVoucherById(@Query('id') id: string) {
    return this.voucherService.findVoucherById(Number(id))
  }

  @ApiTags('Voucher')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Post('add')
  createVoucher(@Body() voucherData: VoucherDto) {
    return this.voucherService.createVoucher(voucherData)
  }

  @ApiTags('Voucher')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Put('update/:id')
  updateVoucher(@Param('id') id: string, @Body() voucherData: VoucherDto) {
    return this.voucherService.updateVoucher(Number(id), voucherData)
  }

  @ApiTags('Voucher')
  @UseGuards(AuthGuard("jwt-token-strat"), RolesGuard)
  @Roles(["MANAGER"])
  @Delete('delete/:id')
  deleteVoucher(@Param('id') id: string) {
    return this.voucherService.deleteVoucher(Number(id))
  }
}
