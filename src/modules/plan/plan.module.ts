import { Module } from '@nestjs/common'
import { PlanController } from './plan.controller'
import { PlanService } from './plan.service'
import { PlanRankService } from './plan-rank.service'
import { IsPlanExistImpl } from './dto/utils.dto'

@Module({
  controllers: [PlanController],
  providers: [PlanService, PlanRankService, IsPlanExistImpl],
  exports: [PlanService, PlanRankService],
})
export class PlanModule {}
