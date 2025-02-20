import { IsPlanExist } from './utils.dto'
import { IsString } from 'class-validator'

export class GetPlanDto {
  @IsPlanExist()
  @IsString()
  planId: string
}
