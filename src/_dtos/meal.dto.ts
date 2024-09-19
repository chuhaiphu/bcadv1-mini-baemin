import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { IsString, IsNotEmpty, IsNumber, IsJSON, IsInt, Matches } from 'class-validator'

export class MealDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  NAME: string

  @ApiProperty({
    description: 'JSON array of image URLs for the meal',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    type: 'json',
  })
  @IsNotEmpty()
  IMAGE: Prisma.JsonValue

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  PRICE: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  SHOP_ID: number
}
