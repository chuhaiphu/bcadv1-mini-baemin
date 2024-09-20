import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsInt, IsString, IsArray } from 'class-validator'

export class OrderItemDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  MEAL_ID: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  QUANTITY: number
}

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  STATUS: string
}
