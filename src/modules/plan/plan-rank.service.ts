import { Injectable } from '@nestjs/common'
import { GetOfficalRankDto } from './dto/rank.dto'
import { Nullable } from '@/common/types/utils'
import { Plan, PlanCheckStatusEnum } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class PlanRankService {
  constructor(private readonly prisma: PrismaService) {}

  async getOfficalRank(dto: GetOfficalRankDto) {
    const { year, month, week, officalType, type } = dto

    if (type === PlanCheckStatusEnum.Positive) {
      return this.prisma.plan.findMany({
        where: {
          officalPlanType: officalType,
        },
        orderBy: {
          postiveCheckedDays: 'desc',
        },
      })
    }
  }
}
