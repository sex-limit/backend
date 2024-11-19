import { IsNotEmpty, IsString, Length } from 'class-validator'
import { AuthDto, StudentIdDto } from '@/modules/auth/dto/studentId.dto'
import { Limit } from '@/constants/limit'

export class LoginDto extends AuthDto {}

export class RegisterDto extends AuthDto {
  @Length(Limit.user.minUsernameLength, Limit.user.maxUsernameLength, {
    message: `用户名长度只能为${Limit.user.minUsernameLength}-${Limit.user.maxUsernameLength}`,
  })
  @IsString()
  username: string

  @IsString()
  @Length(6, 30)
  hfutPassword: string
}

export class ForgetPasswordDto extends StudentIdDto {
  @IsString()
  @Length(6, 30)
  hfutPassword: string

  @IsNotEmpty()
  @Length(6, 20, {
    message: '密码只能为6-20位长度',
  })
  @IsString()
  password: string
}
