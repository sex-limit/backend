import { Controller, Post, Body } from '@nestjs/common'
import { PlanService } from './plan.service'
import { CheckInDto } from './dto/check-in.dto'
import { User } from '@/common/decorator/user.decorator'
import { IUser } from '@/app'

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/check-in')
  async checkIn(@Body() checkInDto: CheckInDto, @User() user: IUser) {
    return this.planService.checkIn(checkInDto, user)
  }
}
