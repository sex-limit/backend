import { IsPlanExist } from './utils.dto'
import { IsNumber, IsString, Max, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetMySexLimitPlanDto {
  @Max(new Date().getFullYear() + 1)
  @Min(2020)
  @IsNumber()
  year: number
}

export class GetPlanDetailByYearDto {
  @ApiProperty({
    description: '计划ID',
    example: 'uuid-of-plan',
  })
  @IsPlanExist()
  @IsString()
  planId: string

  @ApiProperty({
    description: '年份',
    example: 2025,
    minimum: 2020,
    maximum: new Date().getFullYear() + 1,
  })
  @Max(new Date().getFullYear() + 1)
  @Min(2020)
  @IsNumber()
  year: number
}
