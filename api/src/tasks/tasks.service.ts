import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return await this.prisma.task.findMany({
      where: { deletedAt: null, user: { id: userId } },
      orderBy: { position: 'asc' },
    })
  }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return await this.prisma.task.create({
      data: {
        id: createTaskDto.id,
        content: createTaskDto.content,
        position: createTaskDto.position,
        user: { connect: { id: userId } },
      },
    })
  }

  async update(updateTaskDto: UpdateTaskDto, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } })
    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...task,
        ...updateTaskDto,
      },
    })
  }

  async delete(taskId: string) {
    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async deleteUndo(taskId: string) {
    return await this.prisma.task.update({
      where: { id: taskId },
      data: {
        deletedAt: null,
      },
    })
  }
}
