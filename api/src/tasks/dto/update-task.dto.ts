export interface UpdateTaskDto {
  content: string
  position: string
  status: 'TODO' | 'DONE'
}
