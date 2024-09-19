import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CredentialsStrategy } from 'src/_strategies/credentials.strategy'
import { JwtTokenStrategy } from 'src/_strategies/jwt.access-token.strategy'
import { JwtRefreshTokenStrategy } from 'src/_strategies/jwt.refresh-token.stategy'


@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, CredentialsStrategy, JwtTokenStrategy, JwtRefreshTokenStrategy, PrismaService],
  controllers: [AuthController]
})
export class AuthModule { }

