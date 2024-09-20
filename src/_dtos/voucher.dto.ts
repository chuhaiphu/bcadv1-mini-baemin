import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, IsISO8601 } from 'class-validator'

export class VoucherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  CONTENT: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  CODE: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  DISCOUNT_TYPE: string

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  MIN_ORDER_VALUE: number

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  DISCOUNT_AMOUNT: number


  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  START_DATE: string

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  END_DATE: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  USAGE_LIMIT: number
}
