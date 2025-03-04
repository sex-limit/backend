import { Controller, Post, Body, Get, Query, Inject } from '@nestjs/common'
import { PlanService } from './plan.service'
import { CheckInDto } from './dto/check-in.dto'
import { User } from '@/common/decorator/user.decorator'
import { IUser } from '@/app'
import { GetMySexLimitPlanDto, GetPlanDetailByYearDto } from './dto/plan.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { GetOfficalRankDto } from './dto/rank.dto'
import { PlanRankService } from './plan-rank.service'
import { GetDayCheckedDetailDto } from './dto/day-checked.dto'

@ApiTags('计划')
@ApiBearerAuth('JWT-auth')
@Controller('plan')
export class PlanController {
  @Inject()
  private readonly planService: PlanService

  @Inject()
  private readonly planRankService: PlanRankService

  @Post('/check-in')
  @ApiOperation({
    summary: '打卡',
    description: '为指定计划进行打卡，可选择打卡状态和快速发布动态',
  })
  async checkIn(@Body() checkInDto: CheckInDto, @User() user: IUser) {
    return this.planService.checkIn(checkInDto, user)
  }

  @ApiOperation({
    summary: '获取首页戒色计划',
    description: '首页获取用户的戒色计划',
  })
  @Get('/my/sex-limit/detail')
  async getMySexLimitDetailPlan(
    @Query() query: GetMySexLimitPlanDto,
    @User() user: IUser,
  ) {
    return this.planService.getMySexLimitDetailPlan(query, user)
  }

  @ApiOperation({
    summary: '获取指定计划的年度打卡记录',
    description: '根据计划ID和年份获取该计划的打卡记录',
  })
  @Get('/my/day-checked')
  async getPlanDetailByYear(
    @Query() query: GetPlanDetailByYearDto,
    @User() user: IUser,
  ) {
    return this.planService.getPlanDetailByYear(query, user)
  }

  @Get('/rank')
  @ApiOperation({
    summary: '获取戒色排行榜',
    description: '获取戒色排行榜',
  })
  async getRank(@Query() query: GetOfficalRankDto) {
    return this.planRankService.getOfficalRank(query)
  }

  async getDayCheckedDetail(
    @Query() query: GetDayCheckedDetailDto,
    @User() user: IUser,
  ) {
    return this.planService.getDayCheckedDetail(query, user)
  }
}
