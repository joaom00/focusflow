import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/users/decorators/user.decorator'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@GetUser('id') userId: string) {
    return this.tasksService.getAll(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser('id') userId: string) {
    return this.tasksService.create(createTaskDto, userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') taskId: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto, taskId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') taskId: string) {
    return this.tasksService.delete( taskId)
  }
}
