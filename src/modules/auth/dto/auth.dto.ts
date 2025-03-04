import { AuthType } from '@/common/enums/Auth.enum'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class AppleLoginDto {
  @ApiProperty({
    description: 'Apple Identity Token',
    example: 'eyJraWQiOiJXNldjT0tC...',
  })
  @IsString()
  identityToken: string

  @ApiProperty({
    description: 'Apple Real User Status',
    example: 2,
    minimum: 1,
  })
  @IsPositive()
  @IsNumber()
  realUserStatus: number
}

export class LoginDto {
  @ApiProperty({
    description: '登录类型',
    enum: AuthType,
    example: AuthType.Apple,
  })
  @IsEnum(AuthType)
  type: AuthType

  @ApiProperty({
    description: 'Apple登录信息',
    type: AppleLoginDto,
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  apple?: AppleLoginDto
}

export class RegisterDto {}
