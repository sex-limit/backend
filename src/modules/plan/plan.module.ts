import { Module } from '@nestjs/common'
import { PlanController } from './plan.controller'
import { PlanService } from './plan.service'
import { IsPlanExistImpl } from './dto/utils.dto'

@Module({
  controllers: [PlanController],
  providers: [PlanService, IsPlanExistImpl],
  exports: [PlanService],
})
export class PlanModule {}
