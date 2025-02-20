import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { PlanService } from './plan.service'
import { CheckInDto } from './dto/check-in.dto'
import { User } from '@/common/decorator/user.decorator'
import { IUser } from '@/app'
import { GetPlanDto } from './dto/plan.dto'

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/check-in')
  async checkIn(@Body() checkInDto: CheckInDto, @User() user: IUser) {
    return this.planService.checkIn(checkInDto, user)
  }

  @Get('/plan')
  async getPlan(@Query() query: GetPlanDto, @User() user: IUser) {
    return this.planService.getPlan(query, user)
  }
}
