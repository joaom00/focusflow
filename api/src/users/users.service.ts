import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { username, email, password } = dto

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = {
      username,
      email,
      password: hashedPassword,
    }

    const user = await this.prisma.user.create({
      data: newUser,
    })

    return user
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    })
  }
}
