import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.userService.create(registerDto)

      const payload = {
        id: user.id,
        email: user.email,
        username: user.username,
      }

      const token = this.jwtService.sign(payload)
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists')
        }
      }
      throw new BadRequestException()
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByUsername(loginDto.username)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password)

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    }
    const token = this.jwtService.sign(payload)

    return { token, user: {id: user.id, username: user.username, email: user.email, created_at: user.createdAt, updated_at: user.updatedAt} }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      return null
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return null
    }
  }
}
