import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, IsInt, IsDateString } from 'class-validator'

export class ReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  CONTENT: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  RATINGS: string

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  SHOP_ID: number
}
