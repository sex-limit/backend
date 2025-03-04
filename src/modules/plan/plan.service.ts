import { Injectable } from '@nestjs/common'
import { CheckInDto } from './dto/check-in.dto'
import { PrismaService } from 'nestjs-prisma'
import { createResponse } from '@/utils/create'
import { IUser } from '@/app'
import { GetMySexLimitPlanDto, GetPlanDetailByYearDto } from './dto/plan.dto'
import { PlanCheckStatusEnum, PlanOfficalType } from '@prisma/client'
import { calculateConsecutiveDays } from '@/utils/date/index'
import { getSetDateArrayAndSort } from '@/utils/date/index'
import { differenceInDays } from 'date-fns'
import { GetDayCheckedDetailDto } from './dto/day-checked.dto'

// TODO: 解决榜单问题
@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(dto: CheckInDto, reqUser: IUser) {
    const { planId, status, quickPost, checkTimes = 0, date: dtoDate } = dto

    const checkInDate = new Date(dtoDate)
    const year = checkInDate.getFullYear()
    const month = checkInDate.getMonth() + 1
    const day = checkInDate.getDate()

    const result = await this.prisma.$transaction(async (t) => {
      const oldPlan = await t.plan.findFirst({
        where: {
          id: planId,
        },
        select: {
          checkedDays: true,
          negativeCheckedDays: true,
          postiveCheckedDays: true,
        },
      })
      const plan = await t.plan.update({
        where: {
          id: planId,
        },
        data: {
          checkedDays: getSetDateArrayAndSort([
            ...oldPlan!.checkedDays,
            checkInDate,
          ]),
          negativeCheckedDays: getSetDateArrayAndSort(
            [...oldPlan!.negativeCheckedDays, checkInDate],
            dto.status === PlanCheckStatusEnum.Positive
              ? checkInDate
              : undefined,
          ),
          postiveCheckedDays: getSetDateArrayAndSort(
            [...oldPlan!.postiveCheckedDays, checkInDate],
            dto.status === PlanCheckStatusEnum.Negative
              ? checkInDate
              : undefined,
          ),
        },
      })

      const allCheckedDays = calculateConsecutiveDays(plan.checkedDays)
      const postiveConsecutiveDays = calculateConsecutiveDays(
        plan.postiveCheckedDays,
      )
      const negativeConsecutiveDays = calculateConsecutiveDays(
        plan.negativeCheckedDays,
      )

      const isDateCheckedInExist = await t.planDayChecked.findFirst({
        where: {
          plan: {
            id: planId,
          },
          year,
          month,
          day,
        },
      })

      const updatePost = {
        ...(quickPost
          ? {
              post: {
                create: {
                  user: {
                    connect: {
                      id: reqUser.id,
                    },
                  },
                  content: quickPost.content,
                  imgs: quickPost.imgs || [],
                },
              },
            }
          : {}),
      }

      if (isDateCheckedInExist) {
        await t.planDayChecked.update({
          where: {
            id: isDateCheckedInExist?.id,
          },
          data: {
            status,
            checkedTimes: checkTimes,
            plan: {
              connect: {
                id: planId,
              },
            },
            ...updatePost,
          },
        })
      } else {
        await t.planDayChecked.create({
          data: {
            year,
            month,
            day,
            status,
            date: checkInDate,
            checkedTimes: checkTimes,
            ...updatePost,
            plan: {
              connect: {
                id: planId,
              },
            },
          },
        })
      }

      const result = await t.plan.update({
        where: {
          id: planId,
        },
        data: {
          postiveLastestConsutiveEndDate:
            postiveConsecutiveDays.latestConsecutive.endDate,
          postiveLastestConsutiveStartDate:
            postiveConsecutiveDays.latestConsecutive.startDate,
          negativeLastestConsutiveEndDate:
            negativeConsecutiveDays.latestConsecutive.endDate,
          negativeLastestConsutiveStartDate:
            negativeConsecutiveDays.latestConsecutive.startDate,

          negativeLongestEndDate:
            negativeConsecutiveDays.longestConsecutive.endDate,
          negativeLongestStartDate:
            negativeConsecutiveDays.longestConsecutive.startDate,
          postiveLongestEndDate:
            postiveConsecutiveDays.longestConsecutive.endDate,
          postiveLongestStartDate:
            postiveConsecutiveDays.longestConsecutive.startDate,

          postiveLongestCheckedDays:
            differenceInDays(
              postiveConsecutiveDays.longestConsecutive.endDate,
              postiveConsecutiveDays.longestConsecutive.startDate,
            ) + 1,
          postiveLatestConsutiveCheckedDays:
            differenceInDays(
              postiveConsecutiveDays.latestConsecutive.endDate,
              postiveConsecutiveDays.latestConsecutive.startDate,
            ) + 1,

          negativeLongestCheckedDays:
            differenceInDays(
              negativeConsecutiveDays.longestConsecutive.endDate,
              negativeConsecutiveDays.longestConsecutive.startDate,
            ) + 1,
          negativeLatestConsutiveCheckedDays:
            differenceInDays(
              negativeConsecutiveDays.latestConsecutive.endDate,
              negativeConsecutiveDays.latestConsecutive.startDate,
            ) + 1,

          continuousCheckDay: postiveConsecutiveDays.latestConsecutive.days,
          maxContinuousCheckDay: allCheckedDays.longestConsecutive.days,
        },
        select: {
          postiveLastestConsutiveEndDate: true,
          postiveLastestConsutiveStartDate: true,
          negativeLastestConsutiveEndDate: true,
          negativeLastestConsutiveStartDate: true,
          postiveLongestEndDate: true,
          postiveLongestStartDate: true,
          negativeLongestEndDate: true,
          negativeLongestStartDate: true,
          continuousCheckDay: true,
          maxContinuousCheckDay: true,
        },
      })

      return result
    })

    return createResponse('打卡成功', result)
  }

  async getMySexLimitDetailPlan(dto: GetMySexLimitPlanDto, user: IUser) {
    const plans = await this.prisma.plan.findFirst({
      where: {
        officalPlanType: PlanOfficalType.SexLimit,
        user: {
          id: user.id,
        },
      },
      select: {
        planDayChecked: {
          where: {
            year: dto.year,
          },
          include: {
            post: true,
          },
        },
        user: true,
        id: true,
        coverAvatar: true,
        coverEmoji: true,
        color: true,
        title: true,
        desc: true,
        checkedDays: false,
        postiveLastestConsutiveEndDate: true,
        postiveLastestConsutiveStartDate: true,
        postiveLongestEndDate: true,
        postiveLongestStartDate: true,
        postiveCheckedDays: false,
        negativeCheckedDays: false,
        postiveLatestConsutiveCheckedDays: true,
        postiveLongestCheckedDays: true,
        negativeLatestConsutiveCheckedDays: true,
        negativeLongestCheckedDays: true,
        negativeLastestConsutiveEndDate: true,
        negativeLastestConsutiveStartDate: true,
      },
    })

    return createResponse('获取成功', plans)
  }

  async getPlanDetailByYear(dto: GetPlanDetailByYearDto, reqUser: IUser) {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id: dto.planId,
        user: {
          id: reqUser.id,
        },
      },
      include: {
        planDayChecked: {
          where: {
            year: dto.year,
          },
          orderBy: {
            date: 'asc',
          },
          include: {
            post: true,
          },
        },
        user: true,
      },
    })

    return createResponse('获取成功', plan)
  }

  async getDayCheckedDetail(dto: GetDayCheckedDetailDto, reqUser: IUser) {
    const { id } = dto

    const result = await this.prisma.plan.findFirst({
      where: {
        id,
        user: {
          id: reqUser.id,
        },
      },
    })

    return createResponse('获取成功', result)
  }
}
