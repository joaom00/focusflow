export type Task = {
  id: string
  status: 'TODO' | 'DONE'
  edit: boolean
  content: string
  position: string
}
