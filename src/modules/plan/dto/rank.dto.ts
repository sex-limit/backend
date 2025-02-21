import { PlanCheckStatusEnum, PlanOfficalType } from '@prisma/client'
import {
  IsEnum,
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
  Max,
} from 'class-validator'

class RankYear {
  @IsNumber()
  year: number
}

class RankMonth extends RankYear {
  @IsNumber()
  month: number
}

class RankWeek {
  @IsDateString()
  startTime: string

  @IsDateString()
  endTime: string
}

class Pagination {
  @Max(20)
  @IsNumber()
  limit: number = 20

  @Max(5)
  @IsNumber()
  page: number = 1
}

export class GetOfficalRankDto extends Pagination {
  @ValidateNested()
  @IsOptional()
  year?: RankYear

  @ValidateNested()
  @IsOptional()
  month?: RankMonth

  @ValidateNested()
  @IsOptional()
  week?: RankWeek

  @IsEnum(PlanOfficalType)
  officalType: PlanOfficalType = PlanOfficalType.SexLimit

  @IsEnum(PlanCheckStatusEnum)
  type: PlanCheckStatusEnum
}
