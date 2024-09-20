import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsInt } from 'class-validator'

export class MealCartDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  MEAL_ID: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  QUANTITY: number
}

export class UpdateMealCartDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  QUANTITY: number
}