import { Injectable } from '@nestjs/common'
import { GetOfficalRankDto } from './dto/rank.dto'
import { Nullable } from '@/common/types/utils'
import { Plan, PlanCheckStatusEnum } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'
import { createResponse } from '@/utils/create'

@Injectable()
export class PlanRankService {
  constructor(private readonly prisma: PrismaService) {}

  async getOfficalRank(dto: GetOfficalRankDto) {
    const { year, month, week, officalType, type } = dto

    let result: Nullable<Plan[]> = null

    if (type === PlanCheckStatusEnum.Positive) {
      result = await this.prisma.plan.findMany({
        where: {
          officalPlanType: officalType,
        },
        orderBy: {
          postiveCheckedDays: 'desc',
        },
        take: 20,
      })
    } else {
      result = await this.prisma.plan.findMany({
        where: {
          officalPlanType: officalType,
        },
        orderBy: {
          negativeCheckedDays: 'desc',
        },
        take: 20,
      })
    }

    return createResponse('获取成功', result)
  }
}
