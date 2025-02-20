import { Controller, Post, Body, Get, Query } from '@nestjs/common'
import { PlanService } from './plan.service'
import { CheckInDto } from './dto/check-in.dto'
import { User } from '@/common/decorator/user.decorator'
import { IUser } from '@/app'
import { GetPlanDto } from './dto/plan.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('计划')
@ApiBearerAuth('JWT-auth')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('/check-in')
  @ApiOperation({
    summary: '打卡',
    description: '为指定计划进行打卡，可选择打卡状态和快速发布动态',
  })
  async checkIn(@Body() checkInDto: CheckInDto, @User() user: IUser) {
    return this.planService.checkIn(checkInDto, user)
  }

  @ApiOperation({
    summary: '获取计划',
    description: '获取用户的计划列表',
  })
  @Get('/my/detail')
  async getPlan(@Query() query: GetPlanDto, @User() user: IUser) {
    return this.planService.getPlan(query, user)
  }
}
