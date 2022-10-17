import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'

function exclude<User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> {
  for (const key of keys) {
    delete user[key]
  }
  return user
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username)
    if (user) {
      return exclude(user, 'password')
    }
    return user
  }
}
