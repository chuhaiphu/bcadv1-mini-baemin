import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsInt } from 'class-validator'

export class CreateShippingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  DRIVER_NAME: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  CUSTOMER_NAME: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  PHONE: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ADDRESS: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  STATUS: string

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  ORDER_ID: number
}

export class UpdateShippingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  STATUS: string
}
