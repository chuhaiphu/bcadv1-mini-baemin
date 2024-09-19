import { IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  page: number

  @ApiProperty()
  @IsNumber()
  @Min(1)
  limit: number
}
