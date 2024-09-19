import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsBoolean, IsDate, Matches } from 'class-validator'

export class ShopDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  NAME: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ADDRESS: string

  @ApiProperty({ type: String, format: 'time', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'OPEN_TIME must be in the format HH:MM (24-hour)',
  })
  OPEN_TIME: string

  @ApiProperty({ type: String, format: 'time', example: '18:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'CLOSE_TIME must be in the format HH:MM (24-hour)',
  })
  CLOSE_TIME: string


  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  IS_ENABLE: boolean
}
