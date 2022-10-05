import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

app.get('/todos', async (_req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: { position: 'asc' },
  })
  return res.json(todos)
})
app.post('/todos', async (req, res) => {
  const { content, position } = req.body as { content: string; position: number }
  if (position > 1) {
    await prisma.$queryRaw`UPDATE "Todo" SET position = position + 1 WHERE position >= ${position}`
  }
  const todo = await prisma.todo.create({
    data: {
      position,
      content,
    },
  })
  return res.json(todo)
})
app.patch('/todos/:id', async (req, res) => {
  const todo = await prisma.todo.findFirst({
    where: { id: req.params.id },
  })
  const updatedTodo = await prisma.todo.update({
    where: { id: req.params.id },
    data: {
      ...todo,
      ...req.body,
    },
  })
  return res.json(updatedTodo)
})
app.delete('/todos/:id', async (req, res) => {
  const todo = await prisma.todo.delete({
    where: { id: req.params.id },
  })
  await prisma.$queryRaw`update Todo set position = position - 1 where position >= ${todo.position}`
  return res.json(todo)
})

app.listen(3333, () => {
  console.log('Running on port 3333')
})
