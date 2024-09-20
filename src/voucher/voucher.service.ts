import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { VoucherDto } from 'src/_dtos/voucher.dto'

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  async findAllVouchers() {
    return this.prisma.voucher.findMany()
  }

  async findVoucherById(id: number) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { ID: id },
    })
    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`)
    }
    return voucher;
  }

  async createVoucher(voucherData: VoucherDto) {
    return this.prisma.voucher.create({
      data: {
        ...voucherData,
        START_DATE: new Date(voucherData.START_DATE),
        END_DATE: new Date(voucherData.END_DATE),
      },
    })
  }

  async updateVoucher(id: number, voucherData: VoucherDto) {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { ID: id },
    })
    if (!existingVoucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`)
    }
    return this.prisma.voucher.update({
      where: { ID: id },
      data: voucherData,
    })
  }

  async deleteVoucher(id: number) {
    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { ID: id },
    })
    if (!existingVoucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found`)
    }
    return this.prisma.voucher.delete({
      where: { ID: id },
    })
  }
}
