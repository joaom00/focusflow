export type User = {
  id: string
  email: string
  username: string
  created_at: string
  updated_at: string
}

export type SignInResponse = {
  user: User
  token: string
}

export type SignUpResponse = {
  user: User
  token: string
}
