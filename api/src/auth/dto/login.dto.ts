import { IsString, MinLength, MaxLength,  IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string
}
