import { IsPlanExist } from './utils.dto'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetPlanDto {
  @ApiProperty({
    description: '计划ID',
    example: 'uuid-of-plan',
  })
  @IsPlanExist()
  @IsString()
  planId: string
}
