import { IsString, IsEnum } from 'class-validator'
import { PlanCheckStatusEnum } from '@prisma/client'
import { IsPlanExist } from './utils.dto'

export class CheckInDto {
  @IsPlanExist()
  @IsString()
  planId: string

  @IsEnum(PlanCheckStatusEnum)
  status: PlanCheckStatusEnum
}
