import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsNumber,
  Max,
  Min,
  IsDate,
  Validate,
  IsDateString,
} from 'class-validator'
import { PlanCheckStatusEnum } from '@prisma/client'
import { IsPlanExist } from './utils.dto'
import { ApiProperty } from '@nestjs/swagger'

class CheckInQuickPost {
  @ApiProperty({
    description: '快速发布的动态内容',
    example: '今天的打卡状态很好！',
  })
  @IsString()
  content: string

  @ApiProperty({
    description: '快速发布的图片URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  img?: string
}

export class CheckInDto {
  @ApiProperty({
    description: '计划ID',
    example: 'uuid-of-plan',
  })
  @IsPlanExist()
  @IsString()
  planId: string

  @ApiProperty({
    description: '打卡次数',
    minimum: 1,
    maximum: 10,
    default: 1,
    required: false,
  })
  @Max(10)
  @Min(1)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsOptional()
  checkTimes?: number

  @ApiProperty({
    description: '打卡状态',
    enum: PlanCheckStatusEnum,
    example: PlanCheckStatusEnum.Positive,
  })
  @IsEnum(PlanCheckStatusEnum)
  status: PlanCheckStatusEnum

  @ApiProperty({
    description: '快速发布动态',
    type: CheckInQuickPost,
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  quickPost?: CheckInQuickPost

  // TODO: 限制打卡日期不能早于2025年
  @ApiProperty({
    description: '打卡日期，不能早于2025年',
    example: '2025-01-01',
  })
  @IsDateString({})
  date: string
}
