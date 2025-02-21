import { Injectable } from '@nestjs/common'
import { GetOfficalRankDto } from './dto/rank.dto'
import { Nullable } from '@/common/types/utils'
import { Plan } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class PlanRankService {
  constructor(private readonly prisma: PrismaService) {}

  async getOfficalRank(dto: GetOfficalRankDto) {
    const { year, month, week, officalType, type } = dto

    let rank: Nullable<Plan> = null

    if (year) {
      rank = await this.prisma.plan.findFirst({
        where: {
          officalPlanType: officalType,
          planDayChecked: {
            some: {
              year: year.year,
            },
          },
        },
      })
    }
  }
}
