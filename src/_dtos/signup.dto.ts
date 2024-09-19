import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator'

export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullname: string

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string
}
