import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsNumber,
  Max,
  Min,
} from 'class-validator'
import { PlanCheckStatusEnum } from '@prisma/client'
import { IsPlanExist } from './utils.dto'

class CheckInQuickPost {
  @IsString()
  content: string

  @IsString()
  @IsOptional()
  img?: string
}

export class CheckInDto {
  @IsPlanExist()
  @IsString()
  planId: string

  @Max(10)
  @Min(1)
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 0,
  })
  @IsOptional()
  checkTimes?: number

  @IsEnum(PlanCheckStatusEnum)
  status: PlanCheckStatusEnum

  @ValidateNested()
  @IsOptional()
  quickPost?: CheckInQuickPost
}
