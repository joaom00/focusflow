import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string
}
