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
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
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
    const user = await this.userService.findByEmail(loginDto.email)

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password)

    if (!passwordMatches) {
      throw new UnauthorizedException('Access Denied')
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    }
    const access_token = this.jwtService.sign(payload)

    return { access_token }
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
