import { AuthType } from '@/common/enums/Auth.enum'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'

export class AppleLoginDto {
  @IsString()
  identityToken: string

  @IsPositive()
  @IsNumber()
  realUserStatus: number
}

export class LoginDto {
  @IsEnum(AuthType)
  type: AuthType

  @ValidateNested()
  @IsOptional()
  apple?: AppleLoginDto
}

export class RegisterDto {}
