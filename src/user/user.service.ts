import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { SignupDto } from 'src/_dtos/signup.dto'
import { UserDto } from 'src/_dtos/user.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService: JwtService
  ) { }

  async createManagerIfNotExists() {
    const managerEmail = 'manager@example.com';
    const existingManager = await this.prisma.user.findFirst({
      where: { EMAIL: managerEmail, ROLE: 'MANAGER' },
    })
  
    if (!existingManager) {
      const hashedPassword = await bcrypt.hash('manager', 10)
      await this.prisma.user.create({
        data: {
          EMAIL: managerEmail,
          PASSWORD: hashedPassword,
          FULLNAME: 'Manager',
          ROLE: 'MANAGER',
          REFRESH_TOKEN: '',
          VERIFICATION_TOKEN: '',
        },
      })
    }
  }

  // ! USER
  async createUser(signupData: SignupDto) {
    const { email, password, fullname, phone, address } = signupData;

    // Check if email is in use
    const emailInUse = await this.prisma.user.findFirst({
      where: { EMAIL: email },
    })

    if (emailInUse) {
      throw new BadRequestException('Email already in use')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user document and save in PostgreSQL using Prisma
    const newUser = await this.prisma.user.create({
      data: {
        EMAIL: email,
        PASSWORD: hashedPassword,
        FULLNAME: fullname,
        PHONE: phone,
        ADDRESS: address,
        ROLE: 'USER',
        REFRESH_TOKEN: '',
        VERIFICATION_TOKEN: '',
        Cart: {
          create: {} // This creates a new cart for the user
        }
      },
      include: {
        Cart: true // This includes the created cart in the return value
      }
    })

    const { PASSWORD, REFRESH_TOKEN, VERIFICATION_TOKEN, ...result } = newUser
    return result
  }

  async createManager(userDto: UserDto) {
    const { EMAIL, PASSWORD, FULLNAME, PHONE, ADDRESS } = userDto

    // Check if email is in use
    const emailInUse = await this.prisma.user.findFirst({
      where: { EMAIL },
    })

    if (emailInUse) {
      throw new BadRequestException('Email already in use')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(PASSWORD, 10)

    // Create user document and save in PostgreSQL using Prisma
    const newManager = await this.prisma.user.create({
      data: {
        EMAIL,
        PASSWORD: hashedPassword,
        FULLNAME,
        PHONE,
        ADDRESS,
        ROLE: 'MANAGER',
        REFRESH_TOKEN: '',
        VERIFICATION_TOKEN: '',
      },
    })

    const { PASSWORD: _, VERIFICATION_TOKEN, REFRESH_TOKEN, ...result } = newManager
    return result
  }
  
  async updateUser(id: number, userData: UserDto) {
    const user = await this.prisma.user.findUnique({ where: { ID: id } })

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userData.PASSWORD) {
      const hashedPassword = await bcrypt.hash(userData.PASSWORD, 10)
      userData.PASSWORD = hashedPassword
    }

    const updatedUser = await this.prisma.user.update({
      where: { ID: id },
      data: userData,
      select: {
        ID: true,
        EMAIL: true,
        FULLNAME: true,
        PHONE: true,
        ADDRESS: true,
        ROLE: true
      }
    })

    return updatedUser
  }

  async forgetPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { EMAIL: email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationToken = this.jwtService.sign(
      { sub: user.ID, code: verificationCode },
      { expiresIn: '15m' }
    )

    await this.prisma.user.update({
      where: { ID: user.ID },
      data: {
        VERIFICATION_TOKEN: verificationToken,
      },
    })

    await this.mailerService.sendMail({
      to: user.EMAIL,
      subject: 'Password Reset Verification Code',
      template: './password-reset',
      context: {
        fullname: user.FULLNAME,
        email: user.EMAIL,
        verificationCode: verificationCode,
      },
    })

    return { message: 'Verification code sent to your email' }
  }

  async validateVerificationToken(email: string, verification_code: string) {
    const user = await this.prisma.user.findFirst({ where: { EMAIL: email } })
    if (!user || !user.VERIFICATION_TOKEN) {
      throw new UnauthorizedException('User not found or no reset requested')
    }
  
    try {
      const decodedToken = this.jwtService.verify(user.VERIFICATION_TOKEN)
      if (decodedToken.code !== verification_code) {
        throw new UnauthorizedException('Invalid verification code')
      }
  
      return { userId: user.ID, email: user.EMAIL }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired verification token')
    }
  }
  
  async resetPassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.prisma.user.update({
      where: { ID: userId },
      data: {
        PASSWORD: hashedPassword,
        VERIFICATION_TOKEN: "",
      },
      select: {
        ID: true,
        FULLNAME: true,
        EMAIL: true,
        PHONE: true,
        ADDRESS: true,
        ROLE: true,
      }
    })

    return { message: 'Password reset successfully' }
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        ID: 'asc',
      },
      select: {
        ID: true,
        FULLNAME: true,
        EMAIL: true,
        PHONE: true,
        ADDRESS: true,
        ROLE: true,
        // Exclude sensitive fields like PASSWORD, REFRESH_TOKEN, and VERIFICATION_TOKEN
      },
    })
  }

  async findByPagination(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
  
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          ID: 'asc',
        },
        select: {
          ID: true,
          FULLNAME: true,
          EMAIL: true,
          PHONE: true,
          ROLE: true,
        },
      }),
      this.prisma.user.count(),
    ])
  
    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      users
    }
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        ID: id,
      },
      select: {
        ID: true,
        FULLNAME: true,
        EMAIL: true,
        PHONE: true,
        ADDRESS: true,
        ROLE: true,
      }
    })
  }

  async deleteUser(id: number, currentUserId: number, currentUserRole: string) {
    const userToDelete = await this.prisma.user.findUnique({ where: { ID: id } })
    if (!userToDelete) {
      throw new NotFoundException('User not found')
    }
  
    if (currentUserRole === 'USER' && currentUserId !== id) {
      throw new UnauthorizedException('Users can only delete their own account')
    }

    if (currentUserRole === 'MANAGER') {
      if (userToDelete.ROLE === 'ADMIN' || userToDelete.ROLE === 'MANAGER') {
        throw new UnauthorizedException('Managers can only delete user accounts')
      }
    }
  
    if (currentUserRole === 'ADMIN' && userToDelete.ROLE === 'ADMIN' && currentUserId !== id) {
      throw new UnauthorizedException('Admins can only delete their own admin account')
    }
  
    return await this.prisma.user.delete({
      where: { ID: id },
      select: {
        ID: true,
        FULLNAME: true,
        EMAIL: true,
        PHONE: true,
        ADDRESS: true,
        ROLE: true,
      }
    })
  }
  //********************************************************** */

  // // ! TICKET
  // async findAllTicket() {
  //   return this.prisma.ticket.findMany({
  //     include: {
  //       User: true,
  //       Movie_Showtime: true,
  //       Seat: true,
  //     },
  //   })
  // }
  
  // async findTicketById(id: number) {
  //   return this.prisma.ticket.findUnique({
  //     where: { ID: id },
  //     include: {
  //       User: true,
  //       Movie_Showtime: true,
  //       Seat: true,
  //     },
  //   })
  // }

  // async findTicketByUserId(userId: number) {
  //   return this.prisma.ticket.findMany({
  //     where: { USER_ID: userId },
  //     include: {
  //       User: true,
  //       Movie_Showtime: true,
  //       Seat: true,
  //     },
  //   })
  // }
  
  // async findTicketBySeatId(seatId: number) {
  //   return this.prisma.ticket.findMany({
  //     where: { SEAT_ID: seatId },
  //     include: {
  //       User: true,
  //       Movie_Showtime: true,
  //       Seat: true,
  //     },
  //   })
  // }

  // async createTicket(ticketData: TicketDto) {
  //   return this.prisma.ticket.create({
  //     data: ticketData,
  //     include: {
  //       User: true,
  //       Movie_Showtime: true,
  //     },
  //   })
  // }

  // async bookTicket(userId: number, ticketId: number) {
  //   const ticket = await this.prisma.ticket.findUnique({
  //     where: { ID: ticketId },
  //   })
  
  //   if (ticket.USER_ID !== null) {
  //     throw new BadRequestException('This ticket is already booked')
  //   }
  
  //   return this.prisma.ticket.update({
  //     where: { ID: ticketId },
  //     data: {
  //       USER_ID: userId,
  //     },
  //   })
  // }
  
  // async deleteTicket(id: number) {
  //   return this.prisma.ticket.delete({
  //     where: { ID: id },
  //   })
  // }
}
